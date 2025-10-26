"use client";

import { getLaneByID } from "@/api/queries/lane/get.lane-by-id";
import { InlineLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { queryStateParams } from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Youtube } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

interface LaneSideBarProps {
  challenges: Challenge[];
}

export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const params = useParams();
  const { id } = params;

  const challengeRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const [, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  const { setCurrentChellenge } = usePersistStore((store) => store);

  function handleChallengeClick(challenge: Challenge) {
    setChallengeID(challenge.id);
    setCurrentChellenge(challenge);
    setTab(challegeTabs[0].value);
  }

  if (!id) {
    return <div>No Lane ID provided</div>;
  }

  const [challengeID, setChallengeID] = useQueryState(
    queryStateParams.challengeId
  );

  useEffect(() => {
    if (!challengeID && challenges && challenges.length > 0) {
      handleChallengeClick(challenges[0]);
    }
  }, [challenges]);

  useEffect(() => {
    if (challengeID && challengeRefs.current[challengeID]) {
      challengeRefs.current[challengeID]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [challengeID]);

  const { data: laneData, isLoading: loadingLaneData } = useQuery({
    queryKey: ["get-lane-by-id", id],
    queryFn: () => getLaneByID({ id: id as string }),
  });

  return (
    <div className="max-w-sidebarmw shadow-brand-shadow sticky m-1 flex w-full flex-col gap-6 overflow-y-auto rounded-[12px] bg-white p-6">
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
        {challenges.map((challenge) => (
          <li
            key={challenge.id}
            ref={(el) => {
              challengeRefs.current[challenge.id] = el;
            }}
            onClick={() => handleChallengeClick(challenge)}
            className={`relative flex transform cursor-pointer flex-col gap-3 px-2.5 py-3 transition-all duration-200 ease-linear ${challengeID === challenge.id ? "border-l-4 border-solid border-[#444440] bg-[#4444401A]" : "hover:bg-[#4444401A]"}`}
          >
            <h3 className="max-w-[90%] text-base font-semibold">
              {challenge.title}
            </h3>
            <p className="text-xs font-normal">{challenge.objective}</p>

            {challenge.isCompleted && (
              <div className="bg-brand-bright-green absolute top-4 right-3 h-fit w-fit rounded-full">
                <CircleCheck size={16} color="white" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
