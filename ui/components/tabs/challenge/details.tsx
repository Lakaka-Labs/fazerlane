"use client";

import AskAIButton from "@/components/button/ask-ai";
import { usePersistStore } from "@/store/persist.store";
import { useState } from "react";
import YoutubeVideo from "@/components/video/youtube";
import { ChevronDown, Youtube } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionContainer, SectionContent } from "./components";
import { ReferenceLocation } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { getLaneByID } from "@/api/queries/lane/get.lane-by-id";
import { useParams } from "next/navigation";
import { getYouTubeUrl } from "@/utils/format-url";
import { InlineLoader } from "@/components/loader";

export const DetailsTab = () => {
  const params = useParams();
  const { id } = params;

  const { currentChallenge } = usePersistStore((store) => store);

  if (!id) {
    return <div>No Lane ID provided</div>;
  }

  const { data: laneData, isLoading: loadingLaneData } = useQuery({
    queryKey: ["get-lane-by-id", id],
    queryFn: () => getLaneByID({ id: id as string }),
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionContent title="Objective" content={currentChallenge!.objective} />
      <SectionContent
        title="Instructions"
        content={currentChallenge!.instruction}
      />

      <SectionContainer>
        <h2 className="text-base font-semibold">References</h2>

        {loadingLaneData && (
          <div className="flex w-full justify-center">
            <InlineLoader />
          </div>
        )}

        {laneData && (
          <div>
            {currentChallenge?.references.map((ref, index) => (
              <ReferencesDropdown
                key={index}
                location={ref.location}
                purpose={ref.purpose}
                videoLink={getYouTubeUrl(laneData.youtube)}
              />
            ))}
          </div>
        )}
      </SectionContainer>

      <div className="flex justify-end">
        <AskAIButton />
      </div>
    </div>
  );
};

interface ReferenceDropDownProps {
  location: ReferenceLocation;
  purpose: string;
  videoLink: string;
}

const ReferencesDropdown = ({
  location,
  purpose,
  videoLink,
}: ReferenceDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleReferencesDropdown() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div>
      <div
        onClick={handleToggleReferencesDropdown}
        className="border-brand-black/20 flex items-center justify-between border-b"
      >
        <div className="flex w-full cursor-pointer items-center gap-2 px-4 py-6">
          <Youtube size={20} className="text-primary" />
          <h3 className="text-base font-normal">{purpose}</h3>
        </div>

        <ChevronDown size={20} color="#1D1B20" />
      </div>

      <AnimatePresence mode="wait">
        {isOpen && videoLink && (
          <motion.div
            key="video-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-brand-background-dashboard px-8 py-6"
          >
            <div className="h-[450px] w-full overflow-hidden rounded-[12px]">
              <YoutubeVideo
                url={videoLink}
                startTime={location.startTime}
                endTime={location.endTime}
              />
            </div>

            <div className="font-lato mt-3 flex w-full items-center justify-center gap-2 text-center font-semibold">
              <span>From: [{location.startTime}]</span>
              <span>-</span>
              <span>To: [{location.endTime}]</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
