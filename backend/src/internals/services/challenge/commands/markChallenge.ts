import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {
    BadRequestError,
    InvalidAssessmentsError,
    NotFoundError
} from "../../../../packages/errors";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {Message} from "../../../domain/llm";
import {submissionPrompt} from "../../../../packages/prompts/submission.ts";
import type {Challenge} from "../../../domain/challenge";
import type XPRepository from "../../../domain/xp/repository.ts";
import type AppSecrets from "../../../../packages/secret";
import {XPType, type XP} from "../../../domain/xp";
import type {FileParameter} from "../../../domain/objects";



export type markChallengeParameters = {
    id: string
    userId: string
    files?: FileParameter[]
    text?: string
    comment?: string
}

export default class MarkChallenge {
    challengeRepository: ChallengeRepository
    llmRepository: LLMRepository
    xpRepository: XPRepository
    appSecret: AppSecrets

    constructor(
        challengeRepository: ChallengeRepository,
        llmRepository: LLMRepository,
        xpRepository: XPRepository,
        appSecret: AppSecrets
    ) {
        this.challengeRepository = challengeRepository
        this.llmRepository = llmRepository
        this.xpRepository = xpRepository
        this.appSecret = appSecret
    }

    async handle(parameter: markChallengeParameters): Promise<{ pass: boolean, feedback: string }> {
        let {id, userId} = parameter

        const challenge = await this.challengeRepository.getById(id);
        const challengeOrder = await this.challengeRepository.getChallengeOrder(challenge.lane);
        const currentChallengeIndex = challengeOrder.findIndex(c => c.id === id);
        if (currentChallengeIndex === -1) {
            throw new NotFoundError(`challenge not found in lane`);
        }

        const completedChallenges = await this.challengeRepository.getCompletedChallenges(challenge.lane, userId);
        const completedChallengeSet = new Set(completedChallenges);


        if (currentChallengeIndex === 0) {
            return await this.mark(parameter, challenge, completedChallengeSet.has(challenge.id));
        }

        return await this.mark(parameter, challenge, completedChallengeSet.has(challenge.id));
    }

    async waitForFileActive(fileUri: string, maxWaitTime: number = 30000): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const file = await this.llmRepository.getFile(fileUri);
                if (file.state === 'ACTIVE') {
                    return true;
                }
                if (file.state === 'FAILED') {
                    throw new Error(`File processing failed`);
                }
                // Wait 1 second before checking again
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error checking file state:', error);
                return false;
            }
        }
        return false;
    }

    async mark(parameter: markChallengeParameters, challenge: Challenge, completed: boolean): Promise<{
        pass: boolean,
        feedback: string
    }> {
        let {id, userId, files, text, comment} = parameter;
        const previousFeedbacks = await this.challengeRepository.getAttempts(id, userId, {limit: 20, page: 1})
        const recentChallenges = await this.challengeRepository.get(challenge.lane, undefined, {
            toPosition: challenge.position - 1,
            order: "desc",
            limit: 10
        })
        const nextChallenge = await this.challengeRepository.getByPosition(challenge.lane, challenge.position + 1)

        let promptMessage: Message[] = [{
            text: submissionPrompt(challenge, recentChallenges, nextChallenge, previousFeedbacks, text, comment)
        }];

        if (files) {
            for (const {path, mimeType: fileMimetype} of files) {
                const {uri, mimeType} = await this.llmRepository.upload(path, fileMimetype);
                // Wait for file to become active
                const isActive = await this.waitForFileActive(uri);
                if (!isActive) {
                    throw new Error(`File ${uri} failed to become active within timeout period`);
                }

                promptMessage.push({uploadedData: {uri, mimeType}});
            }
        }

        const {response:llmResult} = await this.llmRepository.getText(promptMessage);
        const {pass, feedback} = this.extractChallenges(llmResult);
        await this.xpRepository.streak(userId);
        if (pass && !completed) await this.giveXP(id, userId, challenge.title, challenge.difficulty);
        await this.challengeRepository.addAttempt({challengeId: id, userId, feedback, pass,comment,textSubmission: text});
        return {pass, feedback};
    }

    private async giveXP(challengeId: string, userId: string, title: string, difficulty: string) {
        let attemptsCount = await this.challengeRepository.getTotalAttemptCount(challengeId, userId)
        let loss = attemptsCount * this.appSecret.xpPoints.deductPerFail
        let gain: number
        switch (difficulty) {
            case "easy":
                gain = this.appSecret.xpPoints.easy - loss
                break
            case "medium":
                gain = this.appSecret.xpPoints.medium - loss
                break
            case "hard":
                gain = this.appSecret.xpPoints.hard - loss
                break
            default:
                gain = 0
        }

        await this.xpRepository.addXP({
            userId,
            amount: gain < 0 ? 1 : gain,
            type: XPType.challenge,
            description: `completion of ${title}`,
        })
    }

    private extractChallenges(raw: string): { pass: boolean, feedback: string } {
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidAssessmentsError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        const {pass, feedback} = JSON.parse(jsonString);

        if (!feedback) throw new InvalidAssessmentsError();

        if (typeof pass !== 'boolean') {
            throw new InvalidAssessmentsError();
        }

        return {pass, feedback};
    }

}