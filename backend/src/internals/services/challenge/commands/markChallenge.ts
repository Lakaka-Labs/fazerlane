import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {
    BadRequestError,
    InvalidAssessmentsError,
    InvalidChallengesError,
    NotFoundError
} from "../../../../packages/errors";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {Message} from "../../../domain/llm";
import {submissionPrompt} from "../../../../packages/prompts/submission.ts";
import type {Challenge} from "../../../domain/challenge";

export type markChallengeParameters = {
    id: string
    userId: string
    filePath?: string
    fileMimeType?: string
    text?: string
}

export default class MarkChallenge {
    challengeRepository: ChallengeRepository
    llmRepository: LLMRepository

    constructor(
        challengeRepository: ChallengeRepository,
        llmRepository: LLMRepository
    ) {
        this.challengeRepository = challengeRepository
        this.llmRepository = llmRepository
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
        // if (completedChallengeSet.has(id)) {
        //     return;
        // }

        if (currentChallengeIndex === 0) {
            return await this.mark(parameter, challenge);
        }

        for (let i = 0; i < currentChallengeIndex; i++) {
            const previousChallengeId = challengeOrder[i]?.id;
            if (!completedChallengeSet.has(<string>previousChallengeId)) {
                throw new BadRequestError(
                    `'${challengeOrder[i]?.title}' must be completed first.`
                );
            }
        }

        return await this.mark(parameter, challenge);
    }

    async mark(parameter: markChallengeParameters, challenge: Challenge): Promise<{ pass: boolean, feedback: string }> {
        let {id, userId, filePath, fileMimeType, text} = parameter
        let promptMessage: Message[] = [{
            text: submissionPrompt(challenge, text)
        }]
        if (filePath && fileMimeType) {
            const {uri, mimeType} = await this.llmRepository.upload(filePath, fileMimeType)
            promptMessage.push({uploadedData: {uri, mimeType}})
        }

        const llmResult = await this.llmRepository.getText(promptMessage);
        const {pass, feedback} = this.extractChallenges(llmResult);
        await this.challengeRepository.addAttempt({challengeId: id, userId, feedback, pass});
        if (pass) await this.challengeRepository.markChallenge(id, userId);
        return {pass,feedback}
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