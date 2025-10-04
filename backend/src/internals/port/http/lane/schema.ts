import {z} from "zod";

export default class LaneSchema {
    createLaneSchema = z.object({
        youtube: z.string(),
        startTime: z.string()
            .regex(/^(\d+h)?(\d+m)?(\d+s)?$/)
            .refine((val) => val.length > 0 && /[hms]/.test(val))
            .transform((val) => {
                const hoursMatch = val.match(/(\d+)h/);
                const minutesMatch = val.match(/(\d+)m/);
                const secondsMatch = val.match(/(\d+)s/);

                const hours = hoursMatch ? parseInt(hoursMatch[1]!, 10) : 0;
                const minutes = minutesMatch ? parseInt(minutesMatch[1]!, 10) : 0;
                const seconds = secondsMatch ? parseInt(secondsMatch[1]!, 10) : 0;

                return hours * 3600 + minutes * 60 + seconds;
            }).optional(),
        endTime: z.string()
            .regex(/^(\d+h)?(\d+m)?(\d+s)?$/)
            .refine((val) => val.length > 0 && /[hms]/.test(val))
            .transform((val) => {
                const hoursMatch = val.match(/(\d+)h/);
                const minutesMatch = val.match(/(\d+)m/);
                const secondsMatch = val.match(/(\d+)s/);

                const hours = hoursMatch ? parseInt(hoursMatch[1]!, 10) : 0;
                const minutes = minutesMatch ? parseInt(minutesMatch[1]!, 10) : 0;
                const seconds = secondsMatch ? parseInt(secondsMatch[1]!, 10) : 0;

                return hours * 3600 + minutes * 60 + seconds;
            }).optional()
    })
    getLanesSchema = z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20)
    })
}