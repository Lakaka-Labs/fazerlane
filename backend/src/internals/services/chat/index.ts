import type LLMRepository from "../../domain/llm/repository.ts";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type {MemoriesRepository} from "../../domain/memories/repository.ts";
import type {ChatRepository} from "../../domain/chat/repository.ts";
import Chat from "./commands/chat.ts";
import GetMessages from "./queries/getMessages.ts";
import GetConversations from "./queries/getConversations.ts";

export class Commands {
    chat: Chat

    constructor(
        chatRepository: ChatRepository,
        llmRepository: LLMRepository,
        chatMemoriesRepository: MemoriesRepository,
        challengeRepository: ChallengeRepository
    ) {
        this.chat = new Chat(
            chatRepository,
            llmRepository,
            chatMemoriesRepository,
            challengeRepository,
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
        chatMemoriesRepository: MemoriesRepository,
        challengeRepository: ChallengeRepository
    ) {
        this.commands = new Commands(
            chatRepository,
            llmRepository,
            chatMemoriesRepository,
            challengeRepository
        )
        this.queries = new Queries(chatRepository)
    }
}