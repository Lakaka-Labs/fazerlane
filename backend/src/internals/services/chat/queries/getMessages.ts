import type {ChatRepository} from "../../../domain/chat/repository.ts";
import type {ConversationFilter, MessageFilter} from "../../../domain/chat";

export default class GetMessages {
    constructor(
        private readonly chatRepository: ChatRepository,
    ) {
    }

    handle = async (userId: string, filter: MessageFilter) => {
        await this.chatRepository.GetConversation(filter.conversationId, userId)
        return this.chatRepository.GetConversationHistory(filter)
    }
}