export interface ChallengeEvent {
  id: number;
  lane: string;
  type: "success" | "info" | "fail";
  message: "generating" | "completed" | "failed" | "regenerating";
  createdAt: string; // ISO 8601 datetime string
}
