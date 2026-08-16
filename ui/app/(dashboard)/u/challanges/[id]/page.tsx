"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  Gauge,
  Sparkles,
} from "lucide-react";

import ChallengeTabs from "@/components/tabs/challenge/challenge.tabs";
import { challegeTabs } from "@/components/tabs/challenge/components";
import {
  Chip,
  ChipGroup,
  EmptyState,
  difficultyTone,
  getSubmissionFormatMeta,
} from "@/components/tabs/challenge/challenge.ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryStateParams } from "@/config/routes";
import { getChallenges } from "@/services/queries/challenge/get.challenge";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

export default function Lane() {
  const { id } = useParams();

  const { currentChallenge, setCurrentChellenge } = usePersistStore(
    (store) => store
  );

  const [, setChallengeID] = useQueryState(
    queryStateParams.challengeId,
    parseAsInteger.withDefault(0)
  );
  const [, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  // Same key the layout already primes, so this reads straight from the cache.
  const { data: challenges } = useQuery({
    queryKey: ["get-challenges"],
    queryFn: () => getChallenges({ lane_id: id as string }),
    enabled: Boolean(id),
  });

  const ordered = useMemo(
    () => [...(challenges ?? [])].sort((a, b) => a.position - b.position),
    [challenges]
  );

  const index = currentChallenge
    ? ordered.findIndex((challenge) => challenge.id === currentChallenge.id)
    : -1;

  const previous = index > 0 ? ordered[index - 1] : null;
  const next =
    index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;

  const total = ordered.length;
  const cleared = ordered.filter((challenge) => challenge.isCompleted).length;
  const progress = total > 0 ? (cleared / total) * 100 : 0;

  function goToChallenge(challenge: Challenge | null) {
    if (!challenge) return;

    setChallengeID(challenge.position);
    setCurrentChellenge(challenge);
    setTab(challegeTabs[0].value);
  }

  if (!currentChallenge) {
    return (
      <div className="flex h-full items-center justify-center px-4 py-16">
        <EmptyState
          icon={Sparkles}
          title="No challenge selected"
          description="Pick a challenge from the lane sidebar to see its objective, instructions and the exact moments of the video it came from."
          className="w-full max-w-md bg-white"
        />
      </div>
    );
  }

  const formats = currentChallenge.submissionFormat ?? [];

  return (
    <div className="flex flex-col gap-5 pb-24 lg:pb-8">
      <header className="border-brand-divider shadow-brand-shadow overflow-hidden rounded-2xl border border-solid bg-white">
        <div className="flex flex-col gap-4 p-5 md:p-6">
          {/* Position within the lane + completion state */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-brand-text/45 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] tabular-nums uppercase">
              <span className="bg-brand-red size-1.5 shrink-0 rounded-full" />
              {index >= 0 && total > 0
                ? `Challenge ${pad(index + 1)} of ${pad(total)}`
                : "Challenge"}
            </span>

            {currentChallenge.isCompleted ? (
              <Chip tone="green" icon={CircleCheck}>
                Completed
              </Chip>
            ) : (
              <Chip tone="neutral" icon={CircleDashed}>
                In progress
              </Chip>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-brand-text text-2xl leading-tight font-extrabold tracking-tight text-balance md:text-[28px]">
              {currentChallenge.title}
            </h1>

            {currentChallenge.objective && (
              <p className="text-brand-text/60 max-w-3xl text-sm leading-relaxed md:text-base">
                {currentChallenge.objective}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            {/* One run of chips: difficulty leads, the last format closes it,
                so only the outer edges carry the oversized corner. */}
            <ChipGroup>
              {currentChallenge.difficulty && (
                <Chip
                  key="difficulty"
                  tone={difficultyTone(currentChallenge.difficulty)}
                  icon={Gauge}
                >
                  {currentChallenge.difficulty}
                </Chip>
              )}

              {formats.map((format) => {
                const meta = getSubmissionFormatMeta(format);

                return (
                  <Chip key={format} icon={meta.icon}>
                    {meta.label}
                  </Chip>
                );
              })}
            </ChipGroup>

            <div className="flex items-center gap-2">
              <ChallengeNavButton
                challenge={previous}
                direction="previous"
                onSelect={goToChallenge}
              />
              <ChallengeNavButton
                challenge={next}
                direction="next"
                onSelect={goToChallenge}
              />
            </div>
          </div>
        </div>

        {/* Lane progress rail */}
        {total > 0 && (
          <div className="border-brand-divider bg-brand-background-dashboard/70 flex items-center gap-3 border-t border-solid px-5 py-3 md:px-6">
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
      </header>

      <ChallengeTabs />
    </div>
  );
}

interface ChallengeNavButtonProps {
  challenge: Challenge | null;
  direction: "previous" | "next";
  onSelect: (challenge: Challenge | null) => void;
}

const ChallengeNavButton = ({
  challenge,
  direction,
  onSelect,
}: ChallengeNavButtonProps) => {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  const button = (
    <button
      type="button"
      disabled={!challenge}
      onClick={() => onSelect(challenge)}
      aria-label={`${isPrevious ? "Previous" : "Next"} challenge`}
      className={cn(
        "border-brand-divider text-brand-text/70 flex size-9 items-center justify-center rounded border border-solid bg-white transition-[color,background-color,border-color,box-shadow,scale] duration-200 ease-out motion-safe:active:scale-[0.97]",
        // The pair mirrors the app's oversized-corner motif outwards.
        isPrevious ? "rounded-tl-xl" : "rounded-tr-xl",
        "hover:border-brand-text/25 hover:text-brand-text hover:bg-brand-text/[0.04] hover:shadow-brand-shadow",
        "disabled:pointer-events-none disabled:opacity-35"
      )}
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  );

  if (!challenge) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-56">
        <p className="line-clamp-2">{challenge.title}</p>
      </TooltipContent>
    </Tooltip>
  );
};
