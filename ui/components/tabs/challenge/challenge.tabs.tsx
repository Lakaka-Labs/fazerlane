"use client";

import { motion } from "motion/react";
import { useQueryState } from "nuqs";

import { queryStateParams } from "@/config/routes";
import { cn } from "@/lib/utils";

import { challegeTabs } from "./components";

export default function ChallengeTabs() {
  const [tab, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  const activeTab =
    challegeTabs.find((cTab) => cTab.value === tab) ?? challegeTabs[0];

  return (
    <div className="flex flex-col gap-5">
      {/* Sticks to the top of the scroll column so switching sections never
          requires scrolling back up on long instructions or submission lists. */}
      <div className="sticky top-0 z-20 bg-white/90 pt-1 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Challenge sections"
          className="border-brand-divider flex items-center gap-0.5 overflow-x-auto border-b border-solid sm:gap-1 [&::-webkit-scrollbar]:hidden"
        >
          {challegeTabs.map((cTab) => {
            const isActive = activeTab.value === cTab.value;

            return (
              <motion.button
                key={cTab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                title={cTab.description}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTab(cTab.value)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition-colors duration-200 ease-out md:px-4",
                  isActive
                    ? "text-brand-text font-semibold"
                    : "text-brand-text/40 hover:text-brand-text/70 font-normal"
                )}
              >
                <cTab.icon
                  className="size-4"
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {cTab.label}

                {isActive && (
                  <motion.span
                    layoutId="challenge-tab-underline"
                    className="bg-brand-text absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Keyed remount replays the enter animation on every switch. An
          AnimatePresence exit is deliberately avoided here: the tab bodies own
          their own data fetching, and holding the outgoing one on screen while
          it animates out swallowed the incoming panel. */}
      <motion.div
        key={activeTab.value}
        role="tabpanel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <activeTab.component />
      </motion.div>
    </div>
  );
}
