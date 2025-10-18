import type BaseFilter from "../../../packages/types/filter";

export type Conversation = {
    id: string
    userId: string
    laneId: string
    title: string
    generating: boolean
    createdAt: Date
    updatedAt: Date
}
export type ConversationFilter = BaseFilter & {
    title?: string
    userId?: string
    laneId?: string
}

export type Message = {
    id: string
    conversationId: string
    role: "user" | "model"
    content: string
    token: number
    createdAt: Date
    updatedAt: Date
}

export type MessageFilter = BaseFilter & {
    conversationId: string
}
