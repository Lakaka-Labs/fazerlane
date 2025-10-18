import type {ChatRepository} from "../../../domain/chat/repository.ts";
import type {ConversationFilter} from "../../../domain/chat";

export default class GetConversations {
    constructor(
        private readonly chatRepository: ChatRepository,
    ) {
    }

    handle = async (filter: ConversationFilter) => {
        return this.chatRepository.GetConversations(filter)
    }
}