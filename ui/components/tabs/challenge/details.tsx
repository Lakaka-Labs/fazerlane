"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, ChevronDown, Clapperboard, Play } from "lucide-react";

import YoutubeVideo from "@/components/video/youtube";
import { cn } from "@/lib/utils";
import { getLaneByID } from "@/services/queries/lane/get.lane-by-id";
import { usePersistStore } from "@/store/persist.store";
import { ReferenceLocation } from "@/types/api/challenges";
import { getYouTubeUrl } from "@/utils/format-url";

import {
  Chip,
  EmptyState,
  InsetPanel,
  Markdown,
  SectionBody,
  SectionCard,
  SectionHeader,
  formatTimecode,
  timecodeToSeconds,
} from "./challenge.ui";

export const DetailsTab = () => {
  const { id } = useParams();

  const { currentChallenge } = usePersistStore((store) => store);

  const { data: laneData, isLoading: loadingLaneData } = useQuery({
    queryKey: ["get-lane-by-id", id],
    queryFn: () => getLaneByID({ id: id as string }),
    enabled: Boolean(id),
  });

  if (!currentChallenge) return null;

  const references = currentChallenge.references ?? [];
  const videoLink = laneData ? getYouTubeUrl(laneData.youtube) : "";

  return (
    <div className="flex flex-col gap-5">
      <SectionCard>
        <SectionHeader
          icon={BookOpen}
          title="Instructions"
          description="How to approach this challenge before you attempt it"
        />
        <SectionBody>
          <Markdown className="text-base">
            {currentChallenge.instruction}
          </Markdown>
        </SectionBody>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <SectionHeader
          icon={Clapperboard}
          title="References"
          description="The exact moments of the video this challenge came from"
          bordered={references.length > 0 && !loadingLaneData}
          trailing={
            references.length > 0 ? (
              <Chip>
                {references.length} {references.length === 1 ? "clip" : "clips"}
              </Chip>
            ) : undefined
          }
        />

        {loadingLaneData && (
          <SectionBody className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="bg-brand-text/10 size-10 shrink-0 animate-pulse rounded-lg" />
                <span className="flex flex-1 flex-col gap-2">
                  <span className="bg-brand-text/10 h-3.5 w-3/5 animate-pulse rounded-full" />
                  <span className="bg-brand-text/10 h-3 w-24 animate-pulse rounded-full" />
                </span>
              </div>
            ))}
          </SectionBody>
        )}

        {!loadingLaneData && references.length < 1 && (
          <SectionBody>
            <EmptyState
              icon={Clapperboard}
              title="No references for this challenge"
              description="This one is on you — work from the instructions above."
            />
          </SectionBody>
        )}

        {!loadingLaneData && references.length > 0 && (
          <ul className="divide-brand-divider divide-y divide-solid">
            {references.map((reference, index) => (
              <ReferenceRow
                key={`${reference.purpose}-${index}`}
                index={index + 1}
                purpose={reference.purpose}
                location={reference.location}
                videoLink={videoLink}
              />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

interface ReferenceRowProps {
  index: number;
  purpose: string;
  location: ReferenceLocation;
  videoLink: string;
}

const ReferenceRow = ({
  index,
  purpose,
  location,
  videoLink,
}: ReferenceRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const start = formatTimecode(location?.startTime);
  const end = formatTimecode(location?.endTime);

  const duration =
    timecodeToSeconds(location?.endTime) -
    timecodeToSeconds(location?.startTime);

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition-colors duration-200 md:gap-4 md:px-6",
          isOpen ? "bg-brand-text/[0.03]" : "hover:bg-brand-text/[0.02]"
        )}
      >
        <span
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
            isOpen ? "bg-brand-red" : "bg-brand-red/10"
          )}
        >
          {isOpen ? (
            <Image
              src="/icons/yt-white.png"
              alt=""
              height={18}
              width={18}
              aria-hidden
            />
          ) : (
            <Image
              src="/icons/yt.svg"
              alt=""
              height={18}
              width={18}
              aria-hidden
            />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-brand-text text-sm leading-snug font-semibold md:text-base">
            <span className="text-brand-text/35 mr-2 font-mono text-xs">
              {String(index).padStart(2, "0")}
            </span>
            {purpose}
          </span>

          <span className="flex flex-wrap items-center gap-2">
            <Chip
              tone={isOpen ? "ink" : "neutral"}
              icon={Play}
              className="tracking-normal normal-case"
            >
              {start} – {end}
            </Chip>

            {duration > 0 && (
              <span className="text-brand-text/40 text-[11px] font-medium">
                {formatDuration(duration)}
              </span>
            )}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "text-brand-text/40 group-hover:text-brand-text/70 size-5 shrink-0 transition-transform duration-200 ease-out",
            isOpen && "text-brand-text rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && videoLink && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <InsetPanel className="p-3 md:p-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-black/5">
                  <YoutubeVideo
                    url={videoLink}
                    startTime={location.startTime}
                    endTime={location.endTime}
                    playing={false}
                  />
                </div>

                <div className="text-brand-text/50 mt-3 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase">
                  <span>{start}</span>
                  <span className="bg-brand-text/20 h-px w-6" />
                  <span>{end}</span>
                </div>
              </InsetPanel>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s long`;

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return remainder > 0
    ? `${minutes}m ${remainder}s long`
    : `${minutes}m long`;
}
