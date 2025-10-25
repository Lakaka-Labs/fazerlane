export interface Attempt {
  id: string;
  userId: string;
  challengeId: string;
  feedback: string;
  pass: boolean;
  files: string[];
  textSubmission: string | null;
  comment: string | null;
  filesUrl: string[];
  createdAt: string;
}

export interface AttemptsData {
  attempts: Attempt[];
}

export interface GetAttemptsResponse {
  statusCode: number;
  message: string;
  data: AttemptsData;
}
