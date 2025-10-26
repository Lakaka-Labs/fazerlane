import type {Video} from "../../domain/youtube";
import type YoutubeRepository from "../../domain/youtube/repository.ts";
import {BadRequestError} from "../../../packages/errors";
import axios from "axios";

export default class Youtube implements YoutubeRepository {
    apiKey: string
    baseUrl: string

    constructor(apiKey: string, baseUrl: string) {
        this.apiKey = apiKey
        this.baseUrl = baseUrl
    }

    getDetails = async (url: string): Promise<Video> => {
        const id = this.extractVideoId(url);

        const {data} = await axios.get(this.baseUrl, {
            params: {
                key: this.apiKey,
                part: 'snippet,contentDetails,statistics,status',
                id,
            },
        });

        if (!data.items?.length) throw new Error('Video not found');

        const v = data.items[0];
        const s = v.snippet;
        const c = v.contentDetails;

        return {
            id: v.id,
            title: s.title,
            duration: this.iso8601ToSeconds(c.duration),
            thumbnail: s.thumbnails?.maxres?.url || s.thumbnails?.standard?.url || s.thumbnails?.high?.url ||s.thumbnails?.medium?.url || s.thumbnails?.default?.url || ""
        };
    };

    extractVideoId = (url: string): string => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([\w-]{11})/,
            /youtube\.com\/watch\?.*v=([\w-]{11})/,
        ];

        for (const p of patterns) {
            const m = url.match(p);
            if (m && m[1]) return m[1];
        }

        if (/^[\w-]{11}$/.test(url)) return url;
        throw new BadRequestError("invalid youtube url");
    }

    iso8601ToSeconds = (iso: string): number => {
        const m = iso.match(/P(?:(\d+)Y)?(?:(\d+)W)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return 0;

        const y = parseInt(m[1] || '0', 10);
        const w = parseInt(m[2] || '0', 10);
        const d = parseInt(m[3] || '0', 10);
        const h = parseInt(m[4] || '0', 10);
        const min = parseInt(m[5] || '0', 10);
        const s = parseInt(m[6] || '0', 10);

        return (((y * 365 + w * 7 + d) * 24 + h) * 60 + min) * 60 + s;
    };
}