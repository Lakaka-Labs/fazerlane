import type {Segment, Youtube} from "./index.ts";

export default interface ResourceRepository {
    addSegment: (segments: Omit<Segment, "id" | "youtube">[], youtubeId: string) => Promise<void>
    getSegment: (youtubeIds: string[]) => Promise<Segment[]>
    addYoutubes: (youtubes: Youtube[]) => Promise<string[]>
    getYoutubes: (ids: string[]) => Promise<Youtube[]>
}