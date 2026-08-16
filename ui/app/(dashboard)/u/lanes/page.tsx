"use client";

import LearnCard from "@/components/cards/lane/lane.card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLaneDialog } from "@/components/dialog/lane";
import { motion } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import { getFeaturedLanes, getLanes } from "@/services/queries/lane";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Library, Star, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InlineLoader, PageLoader } from "@/components/loader";
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

  const showMobileFab =
    activeTab === tabsTriggerArr[0].value &&
    !lanesLoading &&
    lanesData.length > 0;

  return (
    <Suspense fallback={<PageLoader label="Loading lanes" />}>
      {/* Capped and centred: without a ceiling the three-column grid stretched
          each card to the full width of a wide monitor, and a 900px-wide
          thumbnail is not a card any more. */}
      <div className="lg:px-xLayout max-w-dashmw mx-auto w-full px-4">
        <Tabs
          defaultValue={tabsTriggerArr[0].value}
          value={activeTab}
          onValueChange={setActiveTab}
          className="gap-8"
        >
          {/* The page used to open on a bare, centred tab row: no title, no
              sense of what this screen is, and the one action you came for
              hidden in a floating button at the far corner. Title, purpose and
              action now sit where you start reading. */}
          <header className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="text-brand-text text-2xl font-bold tracking-tight md:text-[28px]">
                  Lanes
                </h1>
                <p className="text-brand-text/50 text-sm leading-relaxed">
                  Every tutorial you have turned into a path, and the ones
                  others are learning from.
                </p>
              </div>

              {/* Narrow screens get the floating button instead — the header
                  scrolls away from an infinitely long grid. */}
              <div className="hidden shrink-0 sm:block">
                <CreateLaneDialog variant="button" />
              </div>
            </div>

            {/* Same underline the challenge workspace uses, so the two tabbed
                surfaces in the app are one pattern rather than two lookalikes.
                The previous underline was a sibling of the trigger and spanned
                the wrapper, so it never lined up with the label it marked. */}
            <TabsList className="border-brand-divider flex h-auto w-full items-center justify-start gap-0.5 overflow-x-auto rounded-none border-b border-solid bg-transparent p-0 sm:gap-1 [&::-webkit-scrollbar]:hidden">
              {tabsTriggerArr.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                  <motion.div key={tab.value} whileTap={{ scale: 0.96 }}>
                    <TabsTrigger
                      value={tab.value}
                      className={cn(
                        "relative flex h-auto flex-none shrink-0 cursor-pointer items-center gap-2 rounded-none border-0 bg-transparent px-3 py-2.5 text-sm shadow-none transition-colors duration-200 ease-out data-[state=active]:bg-transparent data-[state=active]:shadow-none md:px-4",
                        isActive
                          ? "text-brand-text font-semibold"
                          : "text-brand-text/40 hover:text-brand-text/70 font-normal"
                      )}
                    >
                      <tab.icon
                        className="size-4"
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {tab.label}

                      {isActive && (
                        <motion.span
                          layoutId="lanes-tab-underline"
                          className="bg-brand-text absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}
                    </TabsTrigger>
                  </motion.div>
                );
              })}
            </TabsList>
          </header>

          <>
            {lanesData && (
              <TabsContent value={tabsTriggerArr[0].value}>
                {!lanesLoading && lanesData.length < 1 && (
                  <div className="flex items-center justify-center py-20 md:py-28">
                    <CreateLaneDialog />
                  </div>
                )}

                <LaneGrid>
                  {lanesLoading &&
                    Array.from({ length: 6 }).map((_, index) => (
                      <LaneCardSkeleton key={index} />
                    ))}

                  {lanesData.length > 0 &&
                    lanesData.map((lane, index) => (
                      <LearnCard key={index} lane={lane} />
                    ))}
                </LaneGrid>

                {lanesData.length > 0 && (
                  <div
                    ref={lanesLoaderRef}
                    className="flex h-14 w-full items-center justify-center"
                  >
                    {isFetchingNextPage && <InlineLoader size={32} />}
                  </div>
                )}
              </TabsContent>
            )}

            {featuredLanesData && (
              <TabsContent value="featured">
                {!featuredLoading && featuredLanesData.length < 1 && (
                  <div className="border-brand-divider bg-brand-background-dashboard/60 mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
                    <span className="border-brand-divider text-brand-text/30 flex size-12 items-center justify-center rounded-full border border-solid bg-white">
                      <Star className="size-5" strokeWidth={1.8} />
                    </span>

                    <div className="flex flex-col gap-1">
                      <p className="text-brand-text text-sm font-semibold">
                        No featured lanes yet
                      </p>
                      <p className="text-brand-text/50 text-xs leading-relaxed">
                        When lanes are picked out for the community they will
                        show up here. Until then, build your own.
                      </p>
                    </div>
                  </div>
                )}

                <LaneGrid>
                  {featuredLoading &&
                    Array.from({ length: 6 }).map((_, index) => (
                      <LaneCardSkeleton key={index} />
                    ))}

                  {featuredLanesData.length > 0 &&
                    featuredLanesData.map((lane, index) => (
                      <LearnCard key={index} lane={lane} />
                    ))}
                </LaneGrid>

                {featuredLanesData.length > 0 && (
                  <div
                    ref={featuredLoaderRef}
                    className="flex h-14 w-full items-center justify-center"
                  >
                    {featuredisFetchingNextPage && <InlineLoader size={32} />}
                  </div>
                )}
              </TabsContent>
            )}
          </>
        </Tabs>
      </div>

      {showMobileFab && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="fixed right-5 bottom-5 z-10 flex w-fit items-center justify-center sm:hidden">
              <CreateLaneDialog variant="fab" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Lane</p>
          </TooltipContent>
        </Tooltip>
      )}
    </Suspense>
  );
}

/* ---------------------------------------------------------------- layout - */

/**
 * Rows are spaced further apart than columns. With one uniform gap the cards
 * read as an undifferentiated field; giving the vertical axis more room lets
 * each row resolve as a row, which is how you actually scan a grid of
 * thumbnails.
 */
const LaneGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-6 gap-y-9 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
    {children}
  </div>
);

/**
 * Shaped like the card it stands in for — thumbnail, progress ring, two lines of
 * text — so the grid doesn't visibly reflow when the data lands. The previous
 * placeholder was a plain 350px block, which is neither the card's height nor
 * its shape.
 */
const LaneCardSkeleton = () => (
  <div className="flex flex-col gap-2 md:gap-3" aria-hidden>
    <div className="bg-brand-text/10 h-[250px] w-full animate-pulse rounded-md" />

    <div className="flex w-full items-center gap-3 pb-2 md:pb-3">
      <div className="bg-brand-text/10 size-[70px] shrink-0 animate-pulse rounded-full" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="bg-brand-text/10 h-4 w-3/4 animate-pulse rounded-full" />
        <div className="bg-brand-text/10 h-3 w-2/5 animate-pulse rounded-full" />
      </div>
    </div>
  </div>
);

interface LaneTab {
  label: string;
  value: string;
  icon: LucideIcon;
}

const tabsTriggerArr: LaneTab[] = [
  { label: "My Lanes", value: "lanes", icon: Library },
  { label: "Featured Lanes", value: "featured", icon: Star },
];
