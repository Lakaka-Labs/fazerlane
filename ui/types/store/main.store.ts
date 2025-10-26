import { Challenges } from "@/lib/temp";

export type MainStoreState = {
  currentChallenge: Challenges | null;
};

export type MainStoreActions = {
  setCurrentChellenge: (lane: Challenges) => void;
};
