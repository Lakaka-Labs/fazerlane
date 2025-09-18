import type {Segment, Youtube} from "./index.ts";

export default interface ResourceRepository {
    addYoutubes: (youtubes: Youtube[]) => Promise<string[]>
    getYoutubes: (ids: string[]) => Promise<Youtube[]>
}