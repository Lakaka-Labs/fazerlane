"use client";

import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import { InlineLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { queryStateParams } from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LaneSideBarProps {
  challenges: Challenge[];
}

export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const params = useParams();
  const { id } = params;

  const [openChallengeSB, setOpenChallengeSB] = useState(false);

  const challengeRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const [, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  const { setCurrentChellenge } = usePersistStore((store) => store);

  function handleChallengeClick(challenge: Challenge) {
    setChallengeID(challenge.position);
    setCurrentChellenge(challenge);
    // setTab(challegeTabs[0].value);
  }

  if (!id) {
    return <div>No Lane ID provided</div>;
  }

  const [challengeID, setChallengeID] = useQueryState(
    queryStateParams.challengeId,
    parseAsInteger.withDefault(0)
  );

  console.log({ challenges });

  useEffect(() => {
    if (!challengeID && challenges && challenges.length > 0) {
      handleChallengeClick(
        challenges.filter((challenge) => challenge.position === 0)[0]
      );
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
    <>
      <div className="md:max-w-sidebarmw shadow-brand-shadow sticky hidden min-h-[500px] w-full max-w-full flex-col gap-6 overflow-y-auto rounded-[12px] bg-white p-3 md:m-1 md:min-h-full md:p-6 lg:flex">
        {laneData && (
          <h1 className="flex items-center gap-2 text-base font-extrabold">
            <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Image
                src={"/icons/yt-white.png"}
                alt={"youtube icon"}
                height={20}
                width={20}
                className="text-primary my-0.5"
              />
            </div>

            <span>{laneData.youtubeDetails.title}</span>
          </h1>
        )}

        {loadingLaneData && (
          <div className="flex w-full justify-center">
            <InlineLoader fill />
          </div>
        )}

        <ul className="divide-brand-divider divide-y">
          {!loadingLaneData &&
            challenges.map((challenge) => (
              <li
                key={challenge.id}
                ref={(el) => {
                  challengeRefs.current[challenge.id] = el;
                }}
                onClick={() => {
                  handleChallengeClick(challenge);
                  setTab(challegeTabs[0].value);
                }}
                className={`relative flex transform cursor-pointer flex-col gap-3 border-0 px-2.5 py-3 transition-all duration-200 ease-linear ${challengeID === challenge.position ? "border-l-4 border-solid border-[#444440] bg-[#4444401A]" : "hover:bg-[#4444401A]"}`}
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

      <div className="relative flex lg:hidden">
        <div className="fixed right-0 flex flex-col justify-end">
          <div className="relative z-20 flex w-full justify-end pr-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Menu
                  size={20}
                  className={`${openChallengeSB ? "bg-brand-white" : "bg-brand-black/10"} size-5 h-fit w-fit rounded-full p-2 backdrop-blur-xs`}
                  onClick={() => setOpenChallengeSB((o) => !o)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>View Challenges</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {openChallengeSB && (
            <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs" />
          )}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              openChallengeSB
                ? { height: "500px", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            className={`shadow-brand-shadow sticky z-20 mt-1.5 min-h-[500px] w-full flex-col gap-6 overflow-y-auto bg-white p-3 md:m-1 md:min-h-full md:p-6 lg:flex ${openChallengeSB ? "flex" : "hidden"}`}
          >
            {laneData && (
              <h1 className="flex items-center gap-2 text-base font-extrabold">
                <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Image
                    src={"/icons/yt-white.png"}
                    alt={"youtube icon"}
                    height={20}
                    width={20}
                    className="text-primary my-0.5"
                  />
                </div>
                <span>{laneData.youtubeDetails.title}</span>
              </h1>
            )}
            {loadingLaneData && (
              <div className="flex w-full justify-center">
                <InlineLoader fill />
              </div>
            )}
            <ul className="divide-brand-divider divide-y">
              {!loadingLaneData &&
                challenges.map((challenge) => (
                  <li
                    key={challenge.id}
                    ref={(el) => {
                      challengeRefs.current[challenge.id] = el;
                    }}
                    onClick={() => {
                      handleChallengeClick(challenge);
                      setTab(challegeTabs[0].value);
                      setOpenChallengeSB(false);
                    }}
                    className={`relative flex transform cursor-pointer flex-col gap-3 border-0 px-2.5 py-3 transition-all duration-200 ease-linear ${challengeID === challenge.position ? "border-l-4 border-solid border-[#444440] bg-[#4444401A]" : "hover:bg-[#4444401A]"}`}
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
          </motion.div>
        </div>
      </div>
    </>
  );
}
