import type {Conversation, ConversationFilter, Message, MessageFilter} from "./index.ts";

export interface ChatRepository {
    createConversation: (userId: string, laneId: string,title: string) => Promise<string>
    updateConversation: (conversationId: string, params: Partial<Conversation>) => Promise<void>
    GetConversations: (filter: ConversationFilter) => Promise<Conversation[]>
    GetConversation: (conversationId: string, userId: string) => Promise<Conversation>

    AddMessage: (message: Omit<Message, 'id' | 'token' | 'updatedAt' | 'createdAt'>) => Promise<string>
    AddChunkToMessage: (messageId: string, content: string, token: number) => Promise<void>
    EditMessage: (messageId: string, content: string, token: number) => Promise<void>
    GetConversationHistory: (filter: MessageFilter) => Promise<Message[]>
}