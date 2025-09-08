import type {Video} from "./index.ts";

export default interface YoutubeRepository {
    getDetails: (url: string) => Promise<Video>
}