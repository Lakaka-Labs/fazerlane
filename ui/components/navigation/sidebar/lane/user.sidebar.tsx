"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronUp, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SkeletonLoader } from "@/components/loader";
import { challegeTabs } from "@/components/tabs/challenge/components";
import { queryStateParams } from "@/config/routes";
import { cn } from "@/lib/utils";
import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";

const pad = (value: number) => String(value).padStart(2, "0");

interface LaneSideBarProps {
  challenges: Challenge[];
}

/**
 * The lane index — every challenge in the lane, and which one you are on.
 *
 * Two presentations of one list. Above `lg` it is a rail parked beside the
 * workspace. Below `lg` there is no room for a rail, so the same list becomes a
 * bottom sheet reached from a persistent launcher bar.
 *
 * The mobile half used to be a bare hamburger FAB that grew a floating card
 * upward. Three things were wrong with it, and they are the shape of the fix:
 *
 *   1. A hamburger in the corner of a *content* page doesn't say what it opens.
 *      On a phone the sidebar is the only way to move between challenges, so
 *      the control that opens it is primary navigation and should look like it.
 *      The launcher now names the challenge you are on and your position in the
 *      lane, so it earns its footprint even when you never tap it — the same
 *      trade a media player's now-playing bar makes.
 *   2. The panel animated its own `height`, which relayouts its contents on
 *      every frame and drops them. It is a transform now, and it is anchored to
 *      the bottom edge of the screen rather than floating above the button, so
 *      it reads as a surface being pulled up rather than a box being inflated.
 *   3. It was a `div` with an onClick backdrop: no focus trap, no Escape, no
 *      scroll lock, nothing announced. It is a real dialog now, which is what
 *      it always was.
 */
export default function LaneSideBar({ challenges }: LaneSideBarProps) {
  const params = useParams();
  const { id } = params;

  const [sheetOpen, setSheetOpen] = useState(false);

  // Keyed by `position`, which is what `challengeID` holds. The two lists keep
  // separate maps so the mobile sheet's rows don't overwrite the desktop ones.
  const desktopRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const mobileRefs = useRef<Record<number, HTMLLIElement | null>>({});

  const [challengeID, setChallengeID] = useQueryState(
    queryStateParams.challengeId,
    parseAsInteger.withDefault(0)
  );

  const [, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  const { setCurrentChellenge } = usePersistStore((store) => store);

  const { data: laneData, isLoading: loadingLaneData } = useQuery({
    queryKey: ["get-lane-by-id", id],
    queryFn: () => getLaneByID({ id: id as string }),
    enabled: Boolean(id),
  });

  // `position` is the lane's running order, and the workspace's prev/next
  // already walks it sorted. Sorting here too means the list you scan and the
  // arrows you press can't disagree about what comes third.
  const ordered = useMemo(
    () => [...challenges].sort((a, b) => a.position - b.position),
    [challenges]
  );

  const activeIndex = ordered.findIndex(
    (challenge) => challenge.position === challengeID
  );
  const activeChallenge = activeIndex >= 0 ? ordered[activeIndex] : undefined;

  const total = ordered.length;
  const cleared = ordered.filter((challenge) => challenge.isCompleted).length;
  const progress = total > 0 ? (cleared / total) * 100 : 0;

  const openChallenge = useCallback(
    (challenge: Challenge) => {
      setChallengeID(challenge.position);
      setCurrentChellenge(challenge);
    },
    [setChallengeID, setCurrentChellenge]
  );

  useEffect(() => {
    if (!challengeID && ordered.length > 0) {
      const first = ordered.find((challenge) => challenge.position === 0);

      if (first) openChallenge(first);
    }
  }, [ordered]);

  useEffect(() => {
    desktopRefs.current[challengeID]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [challengeID]);

  function selectChallenge(challenge: Challenge) {
    openChallenge(challenge);
    setTab(challegeTabs[0].value);
    setSheetOpen(false);
  }

  if (!id) {
    return <div>No Lane ID provided</div>;
  }

  const laneTitle = laneData?.youtubeDetails?.title;

  return (
    <>
      <div className="md:max-w-sidebarmw shadow-brand-shadow sticky hidden h-fit max-h-[90%] lg:w-full max-w-full flex-col rounded-2xl bg-white pb-4 md:m-1 md:flex">
        {/* Header */}
        <div className="border-brand-divider border-b px-4 py-4 sm:px-6">
          <h1 className="flex items-center gap-3 text-base font-extrabold">
            <LaneMark />

            <span className="line-clamp-2 w-full">
              {loadingLaneData ? (
                <SkeletonLoader height={16} width={220} rounded="full" />
              ) : (
                laneTitle
              )}
            </span>
          </h1>
        </div>

        {loadingLaneData && (
          <ul className="divide-brand-divider divide-y">
            {Array.from({ length: 4 }).map((_, index) => (
              <ChallengeRowSkeleton key={index} />
            ))}
          </ul>
        )}

        {/* Challenges List */}
        <ul className="divide-brand-divider flex-auto divide-y overflow-y-auto">
          {!loadingLaneData &&
            ordered.map((challenge) => (
              <ChallengeRow
                key={challenge.id}
                challenge={challenge}
                isActive={challengeID === challenge.position}
                registerRef={(el) => {
                  desktopRefs.current[challenge.position] = el;
                }}
                onSelect={() => selectChallenge(challenge)}
              />
            ))}
        </ul>
      </div>

      <LaneSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        laneTitle={laneTitle}
        loadingLane={loadingLaneData}
        challenges={ordered}
        challengeID={challengeID}
        activeIndex={activeIndex}
        activeChallenge={activeChallenge}
        cleared={cleared}
        total={total}
        progress={progress}
        mobileRefs={mobileRefs}
        onSelect={selectChallenge}
      />
    </>
  );
}

/* --------------------------------------------------------- mobile sheet - */

interface LaneSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laneTitle?: string;
  loadingLane: boolean;
  challenges: Challenge[];
  challengeID: number;
  activeIndex: number;
  activeChallenge?: Challenge;
  cleared: number;
  total: number;
  progress: number;
  mobileRefs: React.RefObject<Record<number, HTMLLIElement | null>>;
  onSelect: (challenge: Challenge) => void;
}


function LaneSheet({
  open,
  onOpenChange,
  laneTitle,
  loadingLane,
  challenges,
  challengeID,
  activeIndex,
  activeChallenge,
  cleared,
  total,
  progress,
  mobileRefs,
  onSelect,
}: LaneSheetProps) {
  const prefersReducedMotion = useReducedMotion();
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);


  const centreActiveRow = useCallback(
    (list: HTMLUListElement | null) => {
      const row = mobileRefs.current?.[challengeID];

      if (!list || !row) return;

      list.scrollTop =
        row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
    },
    [challengeID, mobileRefs]
  );

  const sheetMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring" as const, stiffness: 420, damping: 40 },
      };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <LaneLauncher
          activeIndex={activeIndex}
          activeChallenge={activeChallenge}
          total={total}
          loading={loadingLane}
        />
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              forceMount
              aria-describedby={undefined}
              /* Radix would otherwise focus the first challenge in the list,
                 which yanks a long lane back to the top the moment it opens. */
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                panelRef.current?.focus();
              }}
            >
              <motion.div
                {...sheetMotion}
                ref={panelRef}
                tabIndex={-1}
                drag={prefersReducedMotion ? false : "y"}
                dragControls={dragControls}
                /* Only the grab handle starts a drag; anywhere else on the
                   sheet the same gesture has to stay available to the list. */
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 600) {
                    onOpenChange(false);
                  }
                }}
                className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[86dvh] w-full flex-col overflow-hidden rounded-tl-4xl rounded-t bg-white shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.35)] outline-none md:hidden"
              >
                <div
                  onPointerDown={(event) => dragControls.start(event)}
                  className="flex shrink-0 touch-none cursor-grab justify-center pt-2.5 pb-1.5 active:cursor-grabbing"
                >
                  <span
                    aria-hidden
                    className="bg-brand-text/20 h-1 w-10 rounded-full"
                  />
                </div>

                {/* Header */}
                <div className="border-brand-divider shrink-0 border-b px-4 pb-3">
                  <div className="flex items-center gap-3">
                    <LaneMark />

                    <DialogPrimitive.Title className="text-brand-text min-w-0 flex-1 text-sm leading-snug font-extrabold">
                      {loadingLane || !laneTitle ? (
                        <SkeletonLoader height={14} width="80%" rounded="full" />
                      ) : (
                        <span className="line-clamp-2">{laneTitle}</span>
                      )}
                    </DialogPrimitive.Title>

                    <DialogPrimitive.Close
                      aria-label="Close challenge list"
                      className="border-brand-divider cursor-pointer text-brand-text/60 hover:text-brand-text hover:bg-brand-text/[0.04] focus-visible:ring-brand-text/25 flex size-8 shrink-0 items-center justify-center rounded border border-solid transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <X className="size-4" strokeWidth={2} />
                    </DialogPrimitive.Close>
                  </div>

                  {/* Same rail and same wording as the challenge header, so the
                      lane's progress reads identically wherever you meet it. */}
                  {total > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="bg-brand-text/10 h-1.5 flex-1 overflow-hidden rounded-full">
                        <div
                          style={{ width: `${progress}%` }}
                          className="bg-brand-text h-full rounded-full transition-[width] duration-700 ease-out"
                        />
                      </div>

                      <span className="text-brand-text/55 shrink-0 text-[11px] font-bold tracking-[0.08em] tabular-nums uppercase">
                        {cleared} / {total} cleared
                      </span>
                    </div>
                  )}
                </div>

                {/* Challenges list. `relative` makes it the offset parent the
                    scroll maths above measures rows against. */}
                <ul
                  ref={centreActiveRow}
                  className="divide-brand-divider relative flex-1 divide-y overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]"
                >
                  {loadingLane
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <ChallengeRowSkeleton key={index} />
                      ))
                    : challenges.map((challenge) => (
                        <ChallengeRow
                          key={challenge.id}
                          challenge={challenge}
                          isActive={challengeID === challenge.position}
                          registerRef={(el) => {
                            mobileRefs.current[challenge.position] = el;
                          }}
                          onSelect={() => onSelect(challenge)}
                        />
                      ))}
                </ul>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/* ------------------------------------------------------- launcher bar - */

interface LaneLauncherProps extends React.ComponentProps<"button"> {
  activeIndex: number;
  activeChallenge?: Challenge;
  total: number;
  loading: boolean;
}

const LaneLauncher = ({
  activeIndex,
  activeChallenge,
  total,
  loading,
  ...props
}: LaneLauncherProps) => (
  <button
    type="button"
    aria-label="Open the challenge list for this lane"
    className={cn(
      "border-brand-divider fixed inset-x-0 z-30 mx-auto flex items-center gap-3 rounded-t rounded-tl-2xl border-2 border-solid bg-white/50 py-2 pr-3.5 pl-4 text-left backdrop-blur-md",
      // Same family as `shadow-brand-shadow`, thrown a little further: this one
      // has to lift off a white card rather than off the dashboard ground.
      "shadow-[0_10px_24px_-10px_rgba(0,0,0,0.28)]",
      "bottom-0",
      "active:bg-brand-text/[0.04] transition-colors duration-200 ease-out",
      "focus-visible:ring-brand-text/25 focus-visible:ring-2 focus-visible:outline-none",
      "md:hidden cursor-pointer"
    )}
    {...props}
  >
    <span className="min-w-0 flex-1">
      <span className="text-brand-text/45 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase">
        <span className="bg-brand-red size-1.5 shrink-0 rounded-full" />

        {loading || total === 0
          ? "Challenges"
          : activeIndex >= 0
            ? `Challenge ${pad(activeIndex + 1)} / ${pad(total)}`
            : `${pad(total)} challenges`}
      </span>

      <span className="text-brand-text mt-0.5 block truncate text-sm font-semibold">
        {activeChallenge?.title ?? "Pick a challenge"}
      </span>
    </span>

    {/* The same badge the cleared rows wear, so "done" looks like one thing. */}
    {activeChallenge?.isCompleted && (
      <span
        aria-hidden
        className="border-brand-green/30 bg-brand-lite-green text-brand-green flex size-5 shrink-0 items-center justify-center rounded-full border border-solid"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    )}

    {/* The whole bar is the control; this only says which way it opens, so it
        stays a bare mark rather than a tile that looks pressable on its own. */}
    <ChevronUp
      aria-hidden
      className="text-brand-text/35 size-4 shrink-0"
      strokeWidth={2.2}
    />
  </button>
);

/* ------------------------------------------------------------- lane mark - */

/** The lane's source badge — same tile in the rail and in the sheet header. */
const LaneMark = () => (
  <span className="bg-brand-red flex size-10 shrink-0 items-center justify-center rounded-full">
    <Image
      src={"/icons/yt-white.png"}
      alt={"youtube icon"}
      height={20}
      width={20}
      className="text-primary"
    />
  </span>
);

/* ------------------------------------------------------------ lane row - */

/**
 * Stands in for a ChallengeRow while the lane loads — same padding, same
 * two-line title/objective stack, same dead rail down the left edge — so the
 * list doesn't jump when the challenges arrive.
 */
const ChallengeRowSkeleton = () => (
  <li
    className="relative flex flex-col gap-2 py-4 pr-11 pl-4 sm:pl-6"
    aria-hidden
  >
    <span className="bg-brand-text/10 absolute inset-y-0 left-0 w-[3px]" />

    <SkeletonLoader height={14} width="70%" rounded="full" />

    <span className="flex flex-col gap-1.5">
      <SkeletonLoader height={10} rounded="full" />
      <SkeletonLoader height={10} width="55%" rounded="full" />
    </span>
  </li>
);

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
