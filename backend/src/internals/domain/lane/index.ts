import type BaseFilter from "../../../packages/types/filter";

export type Lane = {
    id: string;
    creator: string;
    name: string;
    goal?: string;
    schedule?: string;
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    youtubes: string[]
};

export type Youtube = {
    id: string;
    title: string;
    duration: number;
    segmented: boolean
};

export type LaneFilter = {
    creator: string
} & BaseFilter