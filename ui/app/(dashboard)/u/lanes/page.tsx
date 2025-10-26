"use client";

import LearnCard from "@/components/cards/lane/lane.card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLaneDialog } from "@/components/dialog/lane";
import { motion } from "motion/react";
import { useState } from "react";
import { getFeaturedLanes, getLanes } from "@/api/queries/lane";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DUserHome() {
  const [activeTab, setActiveTab] = useState(tabsTriggerArr[0].value);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [limitFL, setLimitFL] = useState(10);
  const [pageFL, setPageFL] = useState(1);

  const { data: lanesData } = useQuery({
    queryKey: ["get-lanes", limit, page],
    queryFn: async () => await getLanes({ limit, page }),
  });

  const { data: featuredLanesData } = useQuery({
    queryKey: ["get-featured-lanes", limit, page],
    queryFn: async () =>
      await getFeaturedLanes({ limit: limitFL, page: pageFL }),
  });

  return (
    <div>
      <Tabs
        defaultValue={tabsTriggerArr[0].value}
        value={activeTab}
        onValueChange={setActiveTab}
        className="gap-10"
      >
        <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
          <TabsList className="flex justify-center gap-10 !bg-transparent p-2">
            {tabsTriggerArr.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <div key={tab.value}>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <TabsTrigger
                      value={tab.value}
                      className="text-brand-black/40 data-[state=active]:text-brand-black !h-8 transform cursor-pointer !rounded-[6px] !bg-transparent !px-2.5 !py-2 text-sm font-normal !shadow-none transition-all duration-200 ease-linear"
                    >
                      {tab.label}
                    </TabsTrigger>
                  </motion.div>

                  {isActive && (
                    <motion.div
                      layoutId="home-lane-tab-underline"
                      className="bg-brand-text h-0.5 w-full"
                    />
                  )}
                </div>
              );
            })}
          </TabsList>
        </div>

        <>
          {lanesData && (
            <TabsContent value={tabsTriggerArr[0].value}>
              {lanesData.length < 1 && (
                <div className="flex items-center justify-center py-28">
                  <CreateLaneDialog />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {lanesData.length > 0 &&
                  lanesData.map((lane, index) => (
                    <LearnCard key={index} lane={lane} />
                  ))}
              </div>

              {lanesData.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="fixed right-10 bottom-10 z-10 flex w-fit items-center justify-center">
                      <CreateLaneDialog customTrigger={true} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create New Lane</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TabsContent>
          )}

          {featuredLanesData && (
            <TabsContent value="featured">
              {featuredLanesData.length < 1 && (
                <div className="flex w-full justify-center py-10 text-center text-base font-medium">
                  No available featured lane
                </div>
              )}

              {featuredLanesData.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                  {featuredLanesData.map((lane, index) => (
                    <LearnCard key={index} lane={lane} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </>
      </Tabs>
    </div>
  );
}

const tabsTriggerArr = [
  { label: "My Lanes", value: "lanes" },
  { label: "Featured Lanes", value: "featured" },
];
