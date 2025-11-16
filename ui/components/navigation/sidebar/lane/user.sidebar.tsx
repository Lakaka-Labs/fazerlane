"use client";

import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import { InlineLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { queryStateParams } from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Menu, X} from "lucide-react";
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
      <div className="md:max-w-sidebarmw shadow-brand-shadow sticky hidden min-h-[500px] w-full max-w-full flex-col rounded-2xl bg-white md:m-1 pb-4 h-[90%] lg:flex">
          {/* Header */}
          {laneData && (
              <div className="border-b border-brand-divider px-4 py-4 sm:px-6">
                  <h1 className="flex items-center gap-3 text-base font-extrabold">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Image
                              src={"/icons/yt-white.png"}
                              alt={"youtube icon"}
                              height={20}
                              width={20}
                              className="text-primary"
                          />
                      </div>
                      <span className="line-clamp-2">
                  {laneData.youtubeDetails.title}
                </span>
                  </h1>
              </div>
          )}

          {/* Loading State */}
          {loadingLaneData && (
              <div className="flex w-full justify-center py-8">
                  <InlineLoader fill />
              </div>
          )}

          {/* Challenges List */}
          <ul className="flex-1 divide-y divide-brand-divider overflow-y-auto ">
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
                          className={`relative cursor-pointer transition-all duration-200 ${
                              challengeID === challenge.position
                                  ? "border-l-4 border-[#444440] bg-[#4444401A]"
                                  : "hover:bg-[#4444401A]"
                          }`}
                      >
                          <div className="flex flex-col gap-2 px-4 py-4 pr-12 sm:px-6">
                              <h3 className="text-sm font-semibold leading-snug sm:text-base">
                                  {challenge.title}
                              </h3>
                              <p className="text-xs font-normal leading-relaxed text-gray-600">
                                  {challenge.objective}
                              </p>
                          </div>
                          {challenge.isCompleted && (
                              <div className="absolute top-4 right-4 rounded-full bg-brand-bright-green p-0.5">
                                  <CircleCheck size={16} color="white" strokeWidth={2.5} />
                              </div>
                          )}
                      </li>
                  ))}
          </ul>

      </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
            {/* Menu Button */}
            <div className="fixed top-[70px] left-0 z-30 p-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setOpenChallengeSB((o) => !o)}
                            className={`${
                                openChallengeSB
                                    ? "bg-brand-white shadow-lg text-brand-black"
                                    : "bg-brand-black text-brand-white"
                            } rounded-full p-2.5 backdrop-blur-sm transition-all duration-100 hover:scale-105`}
                        >
                            { openChallengeSB ?
                                <X size={20} />:
                                <Menu size={20}/>
                            }
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Challenges</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* Backdrop Overlay */}
            {openChallengeSB && (
                <div
                    className="fixed inset-0 top-0 z-20 bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpenChallengeSB(false)}
                />
            )}

            {/* Sidebar Panel */}
            <motion.div
                initial={{ height: 0, opacity: 1 }}
                animate={
                    openChallengeSB
                        ? { height: "calc(100vh - 212px)", opacity: 1 }
                        : { height: 0, opacity: 1 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed left-1/2 -translate-x-1/2 sm:left-2.5 sm:translate-0 top-[142px] z-30 flex w-[90%] max-w-md flex-col overflow-hidden pb-4 rounded-2xl  bg-white shadow-2xl sm:max-w-sm ${
                    openChallengeSB ? "flex" : "hidden"
                }`}
            >
                {/* Header */}
                {laneData && (
                    <div className="border-b border-brand-divider px-4 py-4 sm:px-6">
                        <h1 className="flex items-center gap-3 text-base font-extrabold">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                                <Image
                                    src={"/icons/yt-white.png"}
                                    alt={"youtube icon"}
                                    height={20}
                                    width={20}
                                    className="text-primary"
                                />
                            </div>
                            <span className="line-clamp-2">
                  {laneData.youtubeDetails.title}
                </span>
                        </h1>
                    </div>
                )}

                {/* Loading State */}
                {loadingLaneData && (
                    <div className="flex w-full justify-center py-8">
                        <InlineLoader fill />
                    </div>
                )}

                {/* Challenges List */}
                <ul className="flex-1 divide-y divide-brand-divider overflow-y-auto">
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
                                className={`relative cursor-pointer transition-all duration-200 ${
                                    challengeID === challenge.position
                                        ? "border-l-4 border-[#444440] bg-[#4444401A]"
                                        : "hover:bg-[#4444401A]"
                                }`}
                            >
                                <div className="flex flex-col gap-2 px-4 py-4 pr-12 sm:px-6">
                                    <h3 className="text-sm font-semibold leading-snug sm:text-base">
                                        {challenge.title}
                                    </h3>
                                    <p className="text-xs font-normal leading-relaxed text-gray-600">
                                        {challenge.objective}
                                    </p>
                                </div>
                                {challenge.isCompleted && (
                                    <div className="absolute top-4 right-4 rounded-full bg-brand-bright-green p-0.5">
                                        <CircleCheck size={16} color="white" strokeWidth={2.5} />
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
            </motion.div>
        </div>
    </>
  );
}
