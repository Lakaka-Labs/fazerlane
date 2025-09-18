import {z} from "zod";

export default class LaneSchema {
    createLaneSchema = z.object({
        youtube: z.string()
    })
    getLanesSchema = z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20)
    })
}