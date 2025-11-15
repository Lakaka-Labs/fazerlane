export interface ReferenceLocation {
  startTime: string;
  endTime: string;
}

export interface ChallengeReference {
  challenge: string;
  location: ReferenceLocation;
  purpose: string;
}

export interface Challenge {
  id: string;
  position: number;
  lane: string;
  title: string;
  objective: string;
  instruction: string;
  assignment: string;
  submissionFormat: "video" | "images" | string;
  references: ChallengeReference[];
  difficulty: string;
  isCompleted: boolean;
}

export interface ChallengeData {
  challenges: Challenge[];
}

export interface GetChallengeResponse {
  statusCode: number;
  message: string;
  data: ChallengeData;
}
