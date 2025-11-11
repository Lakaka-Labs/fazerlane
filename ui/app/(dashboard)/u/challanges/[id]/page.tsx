"use client";

// import AskAIButton from "@/components/button/ask-ai";
import ChallengeTabs from "@/components/tabs/challenge/challenge.tabs";
import { usePersistStore } from "@/store/persist.store";

export default function Lane() {
  const { currentChallenge } = usePersistStore((store) => store);

  if (!currentChallenge) {
    return (
      <div className="font-lato flex h-full items-center justify-center text-2xl font-semibold">
        Please select a challenge from the sidebar.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-4 md:pb-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{currentChallenge.title}</h1>
        <span className="text-brand-text/60 border-brand-text/60 rounded-xs border border-solid px-4 py-0.5 text-[10px] font-bold uppercase">
          {currentChallenge.difficulty}
        </span>
      </div>

      <ChallengeTabs />
      {/* <div className="flex justify-end">
        <AskAIButton />
      </div> */}
    </div>
  );
}
