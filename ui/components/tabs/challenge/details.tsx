"use client";

import AskAIButton from "@/components/button/ask-ai";
import { usePersistStore } from "@/store/persist.store";
import { useState } from "react";
import YoutubeVideo from "@/components/video/youtube";
import { ChevronDown, Youtube } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionContainer, SectionContent } from "./components";

export const DetailsTab = () => {
  const { currentChallenge } = usePersistStore((store) => store);

  return (
    <div className="flex flex-col gap-6">
      <SectionContent title="Objective" content={currentChallenge!.objective} />
      <SectionContent
        title="Instructions"
        content={currentChallenge!.instructions}
      />

      <SectionContainer>
        <h2 className="text-base font-semibold">References</h2>

        <div>
          {refrencesArr.map((ref, index) => (
            <ResourcesDropdown key={index} title={ref.title} link={ref.link} />
          ))}
        </div>
      </SectionContainer>

      <div className="flex justify-end">
        <AskAIButton />
      </div>
    </div>
  );
};

const refrencesArr = [
  {
    title: "Explanation of jumping off and incorporating the learned 'shove'.",
    link: "https://www.youtube.com/watch?v=6pGz57bdzuw",
  },
  {
    title:
      "Demonstration of the starting position with both feet on the board.",
    link: "https://www.youtube.com/watch?v=5uSboan45Zg",
  },
  {
    title: "Step-by-step visual demonstration of Variation 1 with overlays.",
    link: "https://www.youtube.com/watch?v=AYbMOjFxPSo",
  },
];

interface ResourcesDropdownProps {
  title: string;
  content?: React.ReactNode;
  link?: string;
}

const ResourcesDropdown = ({
  title,
  content,
  link,
}: ResourcesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleResourcesDropdown() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div>
      <div
        onClick={handleToggleResourcesDropdown}
        className="border-brand-black/20 flex items-center justify-between border-b"
      >
        <div className="flex w-full cursor-pointer items-center gap-2 px-4 py-6">
          <Youtube size={20} className="text-primary" />
          <h3 className="text-base font-normal">{title}</h3>
        </div>

        <ChevronDown size={20} color="#1D1B20" />
      </div>

      <AnimatePresence mode="wait">
        {isOpen && content && (
          <motion.div
            key="content-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-brand-background-dashboard px-8 py-6"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen && link && (
          <motion.div
            key="video-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-brand-background-dashboard px-8 py-6"
          >
            <div className="h-[450px] w-full overflow-hidden rounded-[12px]">
              <YoutubeVideo url={link} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
