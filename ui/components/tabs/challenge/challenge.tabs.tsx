"use client";

import { usePersistStore } from "@/store/persist.store";
import { motion } from "motion/react";
import { useMemo } from "react";
import { challegeTabs } from "./components";

export default function ChallengeTabs() {
  const { currentChallengeId, currentChallengeTab, setCurrentChallengeTab } =
    usePersistStore((store) => store);

  function handleTabClick(value: string) {
    setCurrentChallengeTab(value);
  }

  const tabs = useMemo(
    () => challegeTabs,
    [currentChallengeTab, currentChallengeId]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const isActive = currentChallengeTab === tab.value;
            return (
              <div key={tab.value} onClick={() => handleTabClick(tab.value)}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`transform px-3 py-2 text-base font-normal transition-all duration-200 ease-linear ${isActive ? "text-brand-text" : "text-brand-text/40"}`}
                >
                  {tab.label}
                </motion.button>
                {isActive && (
                  <motion.div
                    layoutId="challenge-tab-underline"
                    className="bg-brand-text h-0.5 w-full"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="bg-brand-border -mt-0.5 h-0.5 w-full" />
      </div>

      <div>
        {tabs.map((tab) => {
          if (tab.value === currentChallengeTab) {
            const TabComponent = tab.component;
            return <TabComponent key={tab.value} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
