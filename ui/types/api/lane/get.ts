export interface YoutubeDetails {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
}

export interface Lane {
  id: string;
  creator: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  youtube: string;
  startTime: string | null;
  endTime: string | null;
  challengeGenerated: boolean;
  youtubeDetails: YoutubeDetails;
  totalChallenges: string;
  challengesPassed: string;
  totalAttempts: string;
}

export interface LanesData {
  lanes: Lane[];
}

export interface GetLaneResponse {
  statusCode: number;
  message: string;
  data: LanesData;
}

export interface GetLaneByIDResponse {
  statusCode: number;
  message: string;
  data: {
    lane: Lane;
  };
}
