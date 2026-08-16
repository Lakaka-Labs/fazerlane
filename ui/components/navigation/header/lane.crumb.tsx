"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface LaneCrumbProps {
  /** Set only on a lane's challenge workspace; the crumb is absent elsewhere. */
  laneId?: string;
}

/**
 * Which lane you are in, and how far through it you are.
 *
 * The sidebar owns the lane title inside the workspace, but it collapses into a
 * bottom sheet under `lg` and scrolls away behind the challenge list above it —
 * so on a long lane the answer to "what am I working on" leaves the screen. The
 * header is the one strip that never moves.
 *
 * The n-of-m count exists nowhere else in the workspace: the sidebar marks
 * individual challenges cleared, but the aggregate only appears on the lane card
 * back on `/u/lanes`. Bringing it here means you can see the finish line without
 * leaving the work.
 *
 * The query key matches the layout's and the sidebar's, so this shares their
 * cache entry and costs no extra request.
 */
export default function LaneCrumb({ laneId }: LaneCrumbProps) {
  const { data: lane, isLoading } = useQuery({
    queryKey: ["get-lane-by-id", laneId],
    queryFn: () => getLaneByID({ id: laneId! }),
    enabled: Boolean(laneId),
  });

  if (!laneId) return null;

  const title = lane?.youtubeDetails?.title;
  const total = Number(lane?.totalChallenges ?? 0);
  const passed = Number(lane?.challengesPassed ?? 0);
  const hasProgress = Number.isFinite(total) && total > 0;
  const isComplete = hasProgress && passed >= total;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5">
      <ChevronRight
        aria-hidden
        className="text-brand-text/25 size-4 shrink-0"
        strokeWidth={2}
      />

      {isLoading || !title ? (
        <span
          aria-hidden
          className="bg-brand-text/10 h-3.5 w-32 shrink-0 animate-pulse rounded-full sm:w-48"
        />
      ) : (
        <>
          <span
            aria-current="page"
            title={title}
            className="text-brand-text/70 min-w-0 truncate text-sm font-semibold"
          >
            {title}
          </span>

          {hasProgress && (
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Matches the chip spec the challenge workspace uses — square
                    corners, because a status label isn't something you act on.
                    Green on completion echoes the sidebar's cleared badge. */}
                <span
                  className={cn(
                    "hidden shrink-0 cursor-default rounded border border-solid px-2 py-1 text-[10px] leading-none font-bold tracking-[0.08em] uppercase sm:inline-flex",
                    isComplete
                      ? "border-brand-green/25 bg-brand-lite-green text-brand-green"
                      : "border-brand-text/15 bg-brand-text/[0.04] text-brand-text/70"
                  )}
                >
                  {passed}/{total}
                  <span className="sr-only">
                    {" "}
                    challenges cleared in this lane
                  </span>
                </span>
              </TooltipTrigger>

              <TooltipContent side="bottom" sideOffset={6}>
                <p>
                  {isComplete
                    ? "Every challenge in this lane is cleared"
                    : `${passed} of ${total} challenges cleared`}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}
