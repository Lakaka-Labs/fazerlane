"use client";

import { getLaneByID } from "@/api/queries/lane/get.lane-by-id";
import { InlineLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { Youtube } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface LaneSideBarProps {
  challenges: Challenge[];
}

export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const params = useParams();
  const { id } = params;

  const {
    setCurrentChellenge,
    currentChallengeId,
    setCurrentChellengeId,
    setCurrentChallengeTab,
  } = usePersistStore((store) => store);

  function handleChallengeClick(challenge: Challenge) {
    setCurrentChellengeId(challenge.id);
    setCurrentChellenge(challenge);
    setCurrentChallengeTab(challegeTabs[0].value);
  }

  if (!id) {
    return <div>No Lane ID provided</div>;
  }

  const { data: laneData, isLoading: loadingLaneData } = useQuery({
    queryKey: ["get-lane-by-id", id],
    queryFn: () => getLaneByID({ id: id as string }),
  });

  useEffect(() => {
    if (challenges.length > 0 && !currentChallengeId) {
      handleChallengeClick(challenges[0]);
    }
  }, [challenges, currentChallengeId]);

  return (
    <div className="max-w-sidebarmw shadow-brand-shadow sticky m-1 flex w-full flex-col gap-6 overflow-y-auto rounded-[12px] p-6">
      {laneData && (
        <h1 className="flex gap-2 text-base font-extrabold">
          <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Youtube size={16} color="white" />
          </div>

          <span>{laneData.youtubeDetails.title}</span>
        </h1>
      )}

      {loadingLaneData && (
        <div className="flex w-full justify-center">
          <InlineLoader />
        </div>
      )}

      <ul className="divide-brand-divider divide-y">
        {challenges.map((lane) => (
          <li
            key={lane.id}
            onClick={() => handleChallengeClick(lane)}
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
