"use client";

import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import { InlineLoader, SkeletonLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { queryStateParams } from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { Check, Menu, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface LaneSideBarProps {
  challenges: Challenge[];
}

export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const params = useParams();
  const { id } = params;

  const [openChallengeSB, setOpenChallengeSB] = useState(false);

  // Keyed by `position`, which is what `challengeID` holds. The two lists keep
  // separate maps so the mobile sheet's rows don't overwrite the desktop ones.
  const desktopRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const mobileRefs = useRef<Record<number, HTMLLIElement | null>>({});

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
    for (const refs of [desktopRefs, mobileRefs]) {
      refs.current[challengeID]?.scrollIntoView({
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
      <div className="md:max-w-sidebarmw shadow-brand-shadow sticky hidden h-fit max-h-[90%] w-full max-w-full flex-col rounded-2xl bg-white pb-4 md:m-1 lg:flex">
        {/* Header */}
        <div className="border-brand-divider border-b px-4 py-4 sm:px-6">
          <h1 className="flex items-center gap-3 text-base font-extrabold">
            <div className="bg-brand-red flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Image
                src={"/icons/yt-white.png"}
                alt={"youtube icon"}
                height={20}
                width={20}
                className="text-primary"
              />
            </div>
            <span className="line-clamp-2">
              {loadingLaneData ? (
                <SkeletonLoader
                  variant="pulse"
                  rounded="none"
                  height={20}
                  width={300}
                />
              ) : (
                laneData && laneData.youtubeDetails.title
              )}
            </span>
          </h1>
        </div>

        {loadingLaneData && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                height={150}
                variant="pulse"
                rounded="lg"
              />
            ))}
          </div>
        )}

        {/* Challenges List */}
        <ul className="divide-brand-divider flex-auto divide-y overflow-y-auto">
          {!loadingLaneData &&
            challenges.map((challenge) => (
              <ChallengeRow
                key={challenge.id}
                challenge={challenge}
                isActive={challengeID === challenge.position}
                registerRef={(el) => {
                  desktopRefs.current[challenge.position] = el;
                }}
                onSelect={() => {
                  handleChallengeClick(challenge);
                  setTab(challegeTabs[0].value);
                  setOpenChallengeSB(false);
                }}
              />
            ))}
        </ul>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Menu Button - Bottom Left */}
        <div className="fixed bottom-4 left-4 z-40">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                  onClick={() => setOpenChallengeSB((o) => !o)}
                  className={`${
                      openChallengeSB
                          ? "bg-brand-white text-brand-black shadow-lg"
                          : "bg-brand-black text-brand-white"
                  } cursor-pointer rounded-full p-2.5 backdrop-blur-sm transition-all duration-100 hover:scale-105`}
              >
                {openChallengeSB ? <X size={20} /> : <Menu size={20} />}
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
                className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpenChallengeSB(false)}
            />
        )}

        {/* Sidebar Panel - Opens from bottom to top */}
        <motion.div
            initial={{ height: 0, opacity: 1 }}
            animate={
              openChallengeSB
                  ? { height: "calc(100dvh - 156px)", opacity: 1 }
                  : { height: 0, opacity: 1 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed bottom-20 left-4 z-30 flex w-[90%] max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-sm pb-4 ${
                openChallengeSB ? "flex" : "hidden"
            }`}
            style={{ originY: 1 }}
        >
          {/* Header */}
          {laneData && (
              <div className="border-brand-divider border-b px-4 py-4 sm:px-6">
                <h1 className="flex items-center gap-3 text-base font-extrabold">
                  <div className="bg-brand-red flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
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
          <ul className="divide-brand-divider flex-1 divide-y overflow-y-auto">
            {!loadingLaneData &&
                challenges.map((challenge) => (
                    <ChallengeRow
                        key={challenge.id}
                        challenge={challenge}
                        isActive={challengeID === challenge.position}
                        registerRef={(el) => {
                          mobileRefs.current[challenge.position] = el;
                        }}
                        onSelect={() => {
                          handleChallengeClick(challenge);
                          setTab(challegeTabs[0].value);
                          setOpenChallengeSB(false);
                        }}
                    />
                ))}
          </ul>
        </motion.div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------ lane row - */

interface ChallengeRowProps {
  challenge: Challenge;
  isActive: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLLIElement | null) => void;
}

/**
 * One challenge in the lane list — shared by the desktop rail and the mobile
 * sheet so the two can't drift apart again.
 *
 * The left edge is the row's only status channel, which is what keeps the two
 * questions a learner asks ("where am I?" and "what have I cleared?") from
 * fighting over the same pixels:
 *
 *   transparent → not started
 *   green       → cleared
 *   soft ink    → the pointer is here
 *   red         → you are here, and it outranks the rest
 *
 * Red is the same accent the challenge header uses for its position dot, so
 * the active row and the "Challenge 03 of 12" marker read as one thought. It
 * also puts real daylight between hover and selection, which previously shared
 * a fill and made every hovered row look like the open one.
 *
 * The rail is always in the layout and only changes color, so selecting a row
 * can't shove its text sideways the way a conditional `border-l` did. For the
 * same reason completion is a color and a badge, never a font or size change.
 */
const ChallengeRow = ({
  challenge,
  isActive,
  onSelect,
  registerRef,
}: ChallengeRowProps) => {
  const isCompleted = challenge.isCompleted;

  return (
    <li ref={registerRef}>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col gap-2 py-4 pr-11 pl-4 text-left transition-colors duration-200 ease-out sm:pl-6",
          "focus-visible:ring-brand-text/25 focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none",
          // Hover sits at roughly half the weight of selection, so the two are
          // separable at a glance even without the rail.
          isActive ? "bg-brand-text/[0.07]" : "hover:bg-brand-text/[0.035]"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] transition-colors duration-200 ease-out",
            isActive
              ? "bg-brand-red"
              : isCompleted
                ? "bg-brand-green/40 group-hover:bg-brand-green/70"
                : "bg-transparent group-hover:bg-brand-text/25"
          )}
        />

        {/* Nudged on hover so the row answers the pointer with movement as
            well as tone — the tint alone is deliberately faint. */}
        <span
          className={cn(
            "flex flex-col gap-2 transition-transform duration-200 ease-out",
            !isActive && "group-hover:translate-x-0.5"
          )}
        >
          <h3
            className={cn(
              "text-brand-text text-sm leading-snug font-semibold sm:text-base",
              isActive && "font-bold"
            )}
          >
            {challenge.title}
          </h3>
          <p className="text-brand-text/55 text-xs leading-relaxed font-normal">
            {challenge.objective}
          </p>
        </span>

        {isCompleted && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            className="border-brand-green/30 bg-brand-lite-green text-brand-green absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border border-solid"
          >
            <Check className="size-3" strokeWidth={3} aria-hidden />
            <span className="sr-only">Completed</span>
          </motion.span>
        )}
      </button>
    </li>
  );
};
