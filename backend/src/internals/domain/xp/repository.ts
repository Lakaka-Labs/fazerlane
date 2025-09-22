import type BaseFilter from "../../../packages/types/filter";
import type {XP, XPFilter} from "./index.ts";

export default interface XPRepository {
    streak: (userId: string) => Promise<void>
    getStreaks: (userId: string, filter: BaseFilter) => Promise<Date[]>
    addXP: (xp: Omit<XP, 'id' | 'createdAt'>) => Promise<void>
    getXPs: (userId: string, filter: XPFilter) => Promise<XP[]>
}