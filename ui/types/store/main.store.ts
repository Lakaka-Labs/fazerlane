import { Challenges } from "@/lib/temp";

export type MainStoreState = {
  currentChallenge: Challenges | null;
  currentChallengeId: string | null;
};

export type MainStoreActions = {
  setCurrentChellenge: (lane: Challenges) => void;
  setCurrentChellengeId: (id: string) => void;
};
