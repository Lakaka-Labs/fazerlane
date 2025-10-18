export type Segment = {
    id: number;
    youtube: string;
    startTime: string;
    endTime: string;
    title: string;
    summary: string;
    learningObjectives: string[];
    visualElements: string[];
    transcription: string;
};

export type Youtube = {
    id: string;
    title: string;
    duration: number;
    thumbnail: string
};