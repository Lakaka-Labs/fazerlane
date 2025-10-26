"use client";

// import { usePersistStore } from "@/store/persist.store";
import { motion } from "motion/react";
import { challegeTabs } from "./components";
import { useQueryState } from "nuqs";
import { queryStateParams } from "@/config/routes";

export default function ChallengeTabs() {
  const [tab, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  // const {
  //   // currentChallengeTab,
  //   //  setCurrentChallengeTab
  // } = usePersistStore((store) => store);

  function handleTabClick(value: string) {
    // setCurrentChallengeTab(value);
    setTab(value);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex gap-6">
          {challegeTabs.map((cTab) => {
            const isActive = tab === cTab.value;
            return (
              <div key={cTab.value} onClick={() => handleTabClick(cTab.value)}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`transform px-3 py-2 text-base font-normal transition-all duration-200 ease-linear ${isActive ? "text-brand-text" : "text-brand-text/40"}`}
                >
                  {cTab.label}
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
        {challegeTabs.map((cTab) => {
          if (cTab.value === tab) {
            return <cTab.component key={cTab.value} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
