import type {Milestone} from "./";

export default interface MilestoneRepository {
    add : (laneId:string,milestone: Omit<Milestone, "id" | "lane">[]) => Promise<void>
    get : (laneId: string) => Promise<Milestone[]>
}