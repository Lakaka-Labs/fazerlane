import type LLMRepository from "../../domain/llm/repository.ts";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type {MemoriesRepository} from "../../domain/memories/repository.ts";
import type {ChatRepository} from "../../domain/chat/repository.ts";
import Chat from "./commands/chat.ts";
import GetMessages from "./queries/getMessages.ts";
import GetConversations from "./queries/getConversations.ts";
import type AppSecrets from "../../../packages/secret";

export class Commands {
    chat: Chat

    constructor(
        chatRepository: ChatRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        appSecrets: AppSecrets
    ) {
        this.chat = new Chat(
            chatRepository,
            llmRepository,
            challengeRepository,
            appSecrets
        )
    }

}

export class Queries {
    getMessages: GetMessages
    getConversations: GetConversations

    constructor(
        chatRepository: ChatRepository
    ) {
        this.getMessages = new GetMessages(chatRepository)
        this.getConversations = new GetConversations(chatRepository)
    }
}

export default class ChatService {
    commands: Commands
    queries: Queries

    constructor(
        chatRepository: ChatRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        appSecrets: AppSecrets
    ) {
        this.commands = new Commands(
            chatRepository,
            llmRepository,
            challengeRepository,
            appSecrets
        )
        this.queries = new Queries(chatRepository)
    }
}
