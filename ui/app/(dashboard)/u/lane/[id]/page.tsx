"use client";

import ChallengeTabs from "@/components/tabs/challenge/challenge.tabs";
import { usePersistStore } from "@/store/persist.store";

export default function Lane() {
  const { currentChallenge } = usePersistStore((store) => store);

  if (!currentChallenge) {
    return <div>Please select a challenge from the sidebar.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{currentChallenge.title}</h1>
        <span className="text-brand-text/60 border-brand-text/60 rounded-sm border border-solid px-5 py-1 text-xs font-bold">
          {currentChallenge.difficulty}
        </span>
      </div>

      <ChallengeTabs />
    </div>
  );
}
