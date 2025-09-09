import type BaseFilter from "../../../packages/types/filter";

export type Lane = {
    id: string;
    creator: string;
    name: string;
    state: 'processing' | 'created' | 'failed'
    goal?: string;
    schedule?: string;
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    youtubes: string[]
};

export type LaneFilter = {
    creator: string
} & BaseFilter