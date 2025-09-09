import {z} from "zod";

export default class LaneSchema {
    createLaneSchema = z.object({
        name: z.string(),
        goal: z.string().optional(),
        schedule: z.string().optional(),
        experience: z.string().optional(),
        youtubes: z.array(z.string()).min(1, "provide at least one youtube video"),
    })

    redoLaneSchema = z.object({
        name: z.string().optional(),
        goal: z.string().optional(),
        schedule: z.string().optional(),
        experience: z.string().optional(),
        youtubes: z.array(z.string()).optional(),
    })
}