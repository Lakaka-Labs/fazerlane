"use client";

import LearnCard from "@/components/cards/lane/lane.card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLaneDialog } from "@/components/dialog/lane";
import { motion } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import { getFeaturedLanes, getLanes } from "@/services/queries/lane";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InlineLoader, SkeletonLoader } from "@/components/loader";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

export default function DUserHome() {
  const lanesLoaderRef = useRef(null);
  const featuredLoaderRef = useRef(null);
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: tabsTriggerArr[0].value,
  });

  const limit = 10;
  const limitFL = 10;

  const {
    data,
    isLoading: lanesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-lanes"],
    queryFn: async ({ pageParam = 1 }) =>
      await getLanes({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length + 1;
    },
  });

  const lanesData = data?.pages.flat() ?? [];

  console.log({ lanesData });

  useEffect(() => {
    if (!lanesData || lanesData.length < limit) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    const el = lanesLoaderRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!data?.pages) return;

    const hasProcessing = data.pages
      .flat()
      .some((lane) => lane.state === "accepted" || lane.state === "processing");

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [data, lanesData, refetch]);

  // featured lanes
  const {
    data: featureddata,
    isLoading: featuredLoading,
    fetchNextPage: featuredfetchNextPage,
    hasNextPage: featuredhasNextPage,
    isFetchingNextPage: featuredisFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-featured-lanes"],
    queryFn: async ({ pageParam = 1 }) =>
      await getFeaturedLanes({ limit: limitFL, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limitFL ? undefined : allPages.length + 1;
    },
  });

  const featuredLanesData = featureddata?.pages.flat() ?? [];

  useEffect(() => {
    if (!featuredLanesData || featuredLanesData.length < limitFL) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          featuredhasNextPage &&
          !featuredisFetchingNextPage
        ) {
          featuredfetchNextPage();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    const el = featuredLoaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [featuredLanesData]);

  return (
    <Suspense fallback={<InlineLoader fill />}>
      <div className="lg:px-xLayout px-4">
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
                        className="text-brand-black/40 data-[state=active]:text-brand-black !h-8 transform cursor-pointer !rounded-[6px] border-0 !bg-transparent !px-2.5 !py-2 text-sm font-normal !shadow-none transition-all duration-200 ease-linear"
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
                {!lanesLoading && lanesData.length < 1 && (
                  <div className="flex items-center justify-center py-28">
                    <CreateLaneDialog />
                  </div>
                )}

                <div
                  className={cn(
                    "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10",
                    lanesLoading && "lg:gap-6"
                  )}
                >
                  {lanesLoading &&
                    Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonLoader
                        key={index}
                        height={350}
                        variant="pulse"
                        rounded="lg"
                      />
                    ))}

                  {lanesData.length > 0 &&
                    lanesData.map((lane, index) => (
                      <LearnCard key={index} lane={lane} />
                    ))}
                </div>

                {lanesData.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="fixed right-5 -bottom-15 z-10 flex w-fit items-center justify-center sm:-bottom-5 md:right-10 lg:bottom-10">
                        <CreateLaneDialog customTrigger={true} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create New Lane</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {lanesData.length > 0 && (
                  <div
                    ref={lanesLoaderRef}
                    className="flex h-14 w-full items-center justify-center"
                  >
                    {isFetchingNextPage && <InlineLoader fill />}
                  </div>
                )}
              </TabsContent>
            )}

            {featuredLanesData && (
              <TabsContent value="featured">
                {!featuredLoading && featuredLanesData.length < 1 && (
                  <div className="flex w-full justify-center py-10 text-center text-base font-medium">
                    No available featured lane
                  </div>
                )}

                <div
                  className={cn(
                    "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10",
                    featuredLoading && "gap-6"
                  )}
                >
                  {featuredLoading &&
                    Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonLoader
                        key={index}
                        height={350}
                        variant="pulse"
                        rounded="lg"
                      />
                    ))}

                  {featuredLanesData.length > 0 &&
                    featuredLanesData.map((lane, index) => (
                      <LearnCard key={index} lane={lane} />
                    ))}
                </div>

                {featuredLanesData.length > 0 && (
                  <div
                    ref={featuredLoaderRef}
                    className="flex h-14 w-full items-center justify-center"
                  >
                    {featuredisFetchingNextPage && <InlineLoader fill />}
                  </div>
                )}
              </TabsContent>
            )}
          </>
        </Tabs>
      </div>
    </Suspense>
  );
}

const tabsTriggerArr = [
  { label: "My Lanes", value: "lanes" },
  { label: "Featured Lanes", value: "featured" },
];
