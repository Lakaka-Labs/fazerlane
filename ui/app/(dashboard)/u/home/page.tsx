"use client";

import LearnCard from "@/components/cards/lane/lane.card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLaneDialog } from "@/components/dialog/lane";
import { Dialog } from "@/components/ui/dialog";
import { motion } from "motion/react";
import { useState } from "react";

export default function DUserHome() {
  const [activeTab, setActiveTab] = useState(tabsTriggerArr[0].value);

  const lanesData = Array.from({ length: 8 });

  return (
    <Dialog>
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

            {/* <div className="w-full lg:w-[120px]">
              <Select>
                <SelectTrigger className="border-brand-border w-full text-sm font-normal lg:w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Recently Added</SelectItem>
                  <SelectItem value="dark">Completed</SelectItem>
                  <SelectItem value="system">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <TabsContent value="lanes">
            {lanesData.length < 1 && (
              <div className="flex items-center justify-center py-28">
                <CreateLaneDialog />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
              {lanesData.length > 0 &&
                lanesData.map((_, index) => <LearnCard key={index} />)}
            </div>
          </TabsContent>
          <TabsContent value="featured">Content for Featured Lane</TabsContent>
        </Tabs>
      </div>
    </Dialog>
  );
}

const tabsTriggerArr = [
  { label: "My Lanes", value: "lanes" },
  { label: "Featured Lanes", value: "featured" },
];
