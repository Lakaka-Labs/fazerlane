"use client";

import { challegeTabs } from "@/components/tabs/challenge/components";
import { Challenges, LaneValues } from "@/lib/temp";
import { usePersistStore } from "@/store/persist.store";

import { Youtube } from "lucide-react";

interface LaneSideBarProps {
  challenges: LaneValues;
}

export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const {
    setCurrentChellenge,
    currentChallengeId,
    setCurrentChellengeId,
    setCurrentChallengeTab,
  } = usePersistStore((store) => store);

  function handleLaneClick(lane: Challenges) {
    setCurrentChellengeId(lane.id);
    setCurrentChellenge(lane);
    setCurrentChallengeTab(challegeTabs[0].value);
  }

  return (
    <div className="max-w-sidebarmw shadow-brand-shadow sticky m-1 flex w-full flex-col gap-6 rounded-[12px] p-6">
      <h1 className="flex gap-2 text-base font-extrabold">
        <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Youtube size={16} color="white" />
        </div>

        <span>{challenges.title}</span>
      </h1>

      <ul className="divide-brand-divider divide-y">
        {challenges.challenges.map((lane) => (
          <li
            key={lane.id}
            onClick={() => handleLaneClick(lane)}
            className={`flex transform cursor-pointer flex-col gap-3 px-2.5 py-3 transition-all duration-200 ease-linear ${currentChallengeId === lane.id ? "border-l-4 border-solid border-[#444440] bg-[#4444401A]" : "hover:bg-[#4444401A]"}`}
          >
            <h3 className="text-base font-semibold">{lane.title}</h3>
            <p className="text-xs font-normal">{lane.objective}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
