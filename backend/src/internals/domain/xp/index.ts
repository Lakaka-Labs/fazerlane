import type BaseFilter from "../../../packages/types/filter";

export type Streak = {
    id: string
    userId: string
    createdAt: Date
}

export enum XPType {
    streak = "streak",
    challenge = "challenge"
}

export type XP = {
    id: string
    userId: string
    amount: number
    type: XPType
    description: string
    createdAt: Date
}

export type XPFilter = BaseFilter & {
    type?: string
}

