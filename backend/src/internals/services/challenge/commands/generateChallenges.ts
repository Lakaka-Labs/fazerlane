import AppSecrets from "../../../../packages/secret";
import type LaneRepository from "../../../domain/lane/repository.ts";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type ResourceRepository from "../../../domain/resource/repository.ts";
import {DuplicateError, InvalidChallengesError, InvalidSegmentsError} from "../../../../packages/errors";
import {getSegmentPrompt} from "../../../../packages/prompts/segment.ts";
import type {Message} from "../../../domain/llm";
import type {Segment, Youtube} from "../../../domain/resource";
import type ProgressRepository from "../../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../../domain/websocket/repository.ts";
import type {BaseProgress} from "../../../domain/progress";
import type LLMRepository from "../../../domain/llm/repository.ts";
import {QueueName} from "../../../domain/queue";
import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import type MilestoneRepository from "../../../domain/milestone/repository.ts";
import type {Milestone} from "../../../domain/milestone";
import {challengeGenerationPrompt} from "../../../../packages/prompts/challengeGeneration.ts";
import type {Challenge} from "../../../domain/challenge";
import type {ChallengeMemoriesRepository, UserMemoriesRepository} from "../../../domain/memories/repository.ts";

export default class GenerateChallenges {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    resourceRepository: ResourceRepository
    progressRepository: ProgressRepository
    progressWebsocketRepository: ProgressWebsocketRepository
    llmRepository: LLMRepository
    challengeRepository: ChallengeRepository
    milestoneRepository: MilestoneRepository
    challengeMemoriesRepository: ChallengeMemoriesRepository
    userMemoriesRepository: UserMemoriesRepository

    constructor(
        laneRepository: LaneRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        milestoneRepository: MilestoneRepository,
        challengeMemoriesRepository: ChallengeMemoriesRepository,
        userMemoriesRepository: UserMemoriesRepository
    ) {
        this.laneRepository = laneRepository
        this.resourceRepository = resourceRepository
        this.appSecrets = appSecrets
        this.progressRepository = progressRepository
        this.progressWebsocketRepository = progressWebsocketRepository
        this.llmRepository = llmRepository
        this.challengeRepository = challengeRepository
        this.milestoneRepository = milestoneRepository
        this.challengeMemoriesRepository = challengeMemoriesRepository
        this.userMemoriesRepository = userMemoriesRepository

    }

    async handle(laneId: string, attempts: number, maxAttempt: number): Promise<boolean> {
        await this.sendProgress({
            lane: laneId,
            message: `generating challenges ${attempts > 1 ? "again" : ""}...`,
            type: "success",
            stage: "challenge_generation"
        });

        const lane = await this.laneRepository.getById(laneId);
        const milestones = await this.milestoneRepository.get(laneId);
        const segments = await this.resourceRepository.getSegment(lane.youtubes)

        let hasRetry = false;
        const failedMilestone: string[] = [];

        for await (const milestone of milestones) {
            try {
                if (!milestone.challengeGenerated) {
                    const challengeMemories = await this.challengeMemoriesRepository.search(milestone.description, laneId)
                    const userMemories = await this.userMemoriesRepository.search(milestone.description, lane.creator)

                    await this.processChallenges(milestone, segments, lane.schedule || "", challengeMemories, userMemories, laneId);

                    await this.sendProgress({
                        lane: laneId,
                        message: `Challenges generated to ${milestone.goal}`,
                        type: "success",
                        stage: "analysis"
                    });
                } else {
                    if (attempts == 1) {
                        await this.sendProgress({
                            lane: laneId,
                            message: `Challenges generated to ${milestone.goal}`,
                            type: "success",
                            stage: "analysis"
                        });
                    }
                }

            } catch (error) {
                console.log({error})
                if (error instanceof DuplicateError) {
                    continue;
                }

                if (attempts >= maxAttempt) {
                    failedMilestone.push(milestone.id);
                    await this.sendProgress({
                        lane: laneId,
                        message: `"could not be generate challenges to ${milestone.goal} after ${maxAttempt} attempts`,
                        type: "fail",
                        stage: "analysis"
                    });
                } else {
                    await this.sendProgress({
                        lane: laneId,
                        message: `"could not be generate challenges to ${milestone.goal}, retry scheduled`,
                        type: "info",
                        stage: "analysis"
                    });
                    hasRetry = true;
                }
            }
        }

        if (attempts >= maxAttempt && failedMilestone.length > 0) {
            const message = `Analysis failed - ${failedMilestone.length} content(s) could not be segmented: ${failedMilestone.join(', ')}`;
            await this.updateLaneAsFailed(laneId, message);
            return false;
        }

        if (!hasRetry) {
            await this.sendProgress({
                lane: laneId,
                message: `Lane Generation Complete`,
                type: "success",
                stage: "analysis"
            });
            await this.laneRepository.update(laneId, {state: "completed"});
        }

        return hasRetry;
    }

    private async updateLaneAsFailed(laneId: string, message: string): Promise<void> {
        await this.laneRepository.update(laneId, {state: "failed"});
        await this.sendProgress({
            lane: laneId,
            message,
            type: "fail",
            stage: "analysis"
        });
    }

    private async processChallenges(milestone: Milestone, segments: Segment[], schedule: string, challengeMemories: string[], userMemories: string[], laneId: string): Promise<void> {
        const messages: Message[] = [
            {text: challengeGenerationPrompt(milestone, schedule, segments, challengeMemories, userMemories)},
        ];
        for (const segment of segments) {
            messages.push({
                data: {
                    fileUri: `https://www.youtube.com/watch?v=${segment.youtube}`,
                    startOffset: this.timeToSeconds(segment.startTime),
                    endOffset: this.timeToSeconds(segment.endTime)
                }
            })
        }
        const llmResult = await this.llmRepository.getText(messages);
        const challenges = this.extractChallenges(llmResult);
        await this.challengeRepository.add(milestone.id, challenges);
        for await (const challenge of challenges) {
            try {
                await this.challengeMemoriesRepository.add(this.convertChallengeToString(challenge), laneId)
            } catch (e) {
                console.log("challenge memory add error", e)
            }
        }
    }

    private extractChallenges(raw: string): Challenge[] {
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidChallengesError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        const challenges = JSON.parse(jsonString) as any[];

        if (!Array.isArray(challenges)) {
            throw new InvalidChallengesError();
        }

        const transformedChallenges = challenges.map(c => ({
            id: crypto.randomUUID(),
            milestone: c.milestone || "default_milestone",
            challengeTitle: c.challenge_title,
            objective: c.objective,
            prerequisiteChallenges: c.prerequisite_challenges || [],
            buildsOnContext: c.builds_on_context,
            practiceInstructions: c.practice_instructions || [],
            assignment: c.assignment,
            submissionFormat: c.submission_format,
            references: (c.references || []).map((r: any) => ({
                challenge: r.challenge || "default_challenge",
                segment: r.segment_id || r.segment,
                referenceLocation: {
                    startTime: r.reference_location?.startTime || "00:00",
                    endTime: r.reference_location?.endTime || "00:00"
                },
                referenceLocationDescription: r.reference_location_description,
                referencePurpose: r.reference_purpose
            })),
            quizzes: (c.quizzes || []).map((q: any) => ({
                challenge: q.challenge || "default_challenge",
                type: q.type,
                question: q.question,
                ...this.getQuizSpecificFields(q)
            })),
            successCriteria: c.success_criteria,
            memoryAdaptations: c.memory_adaptations
        }));

        this.validateChallenges(transformedChallenges);
        return transformedChallenges;
    }

    private getQuizSpecificFields(quiz: any): any {
        switch (quiz.type) {
            case 'single_choice':
                return {options: quiz.options || [], correctAnswer: quiz.correct_answer};
            case 'multiple_choice':
                return {options: quiz.options || [], correctAnswers: quiz.correct_answers || []};
            case 'true_false':
                return {correctAnswer: quiz.correct_answer};
            case 'sequence':
                return {options: quiz.options || [], correctOrder: quiz.correct_order || []};
            case 'drag_drop':
                return {pairs: quiz.pairs || []};
            case 'slider':
                return {
                    minValue: quiz.min_value || 0,
                    maxValue: quiz.max_value || 100,
                    correctRange: quiz.correct_range || {min: 0, max: 100},
                    unit: quiz.unit || ""
                };
            default:
                throw new InvalidChallengesError();
        }
    }

    private validateChallenges(challenges: Challenge[]): void {
        for (const c of challenges
            ) {
            if (!c.challengeTitle || !c.objective || !c.assignment ||
                !c.submissionFormat || !c.successCriteria ||
                !Array.isArray(c.prerequisiteChallenges) || !Array.isArray(c.practiceInstructions) ||
                !Array.isArray(c.references) || !Array.isArray(c.quizzes)) {
                throw new InvalidChallengesError();
            }
        }
    }

    sendProgress = async (progress: BaseProgress) => {
        await this.progressRepository.add(progress)
        this.progressWebsocketRepository.Broadcast({data: progress}, progress.lane)
    }


    timeToSeconds(timeString
                  :
                  string
    ):
        number {
        const parts = timeString.trim().split(':');
        if (parts.length < 2 || parts.length > 3) {
            throw new Error('Invalid time format');
        }
        const numbers = parts.map(p => parseInt(p, 10));
        if (numbers.some(n => isNaN(n) || n < 0)) {
            throw new Error('Invalid time format');
        }
        if (numbers.length === 2) {
            const [m, s] = numbers;
            if (!m || !s) throw new Error("Invalid time format")
            if (s >= 60) throw new Error('Invalid time format');
            return m * 60 + s;
        }
        const [h, m, s] = numbers;
        if (!h || !m || !s) throw new Error("Invalid time format")
        if (m >= 60 || s >= 60) throw new Error('Invalid time format');
        return h * 3600 + m * 60 + s;
    }

    convertChallengeToString(challenge: Challenge): string {
        const parts = [
            `challenge_title: "${challenge.challengeTitle}"`,
            `objective: "${challenge.objective}"`,
            `practice_instructions: [${challenge.practiceInstructions.map(instruction => `"${instruction}"`).join(', ')}]`,
            `assignment: "${challenge.assignment}"`,
            `success_criteria: "${challenge.successCriteria}"`
        ];

        return parts.join(', ');
    }
}