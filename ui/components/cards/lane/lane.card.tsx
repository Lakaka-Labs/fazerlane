"use client";

import {removeLane} from "@/services/mutations/lane/delete";
import {redoLane} from "@/services/mutations/lane/redo";
import appRoutes from "@/config/routes";
import {Lane} from "@/types/api/lane";
import {dateToNow} from "@/utils/date-to-now";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {EllipsisVertical, OctagonAlert} from "lucide-react";
import {LogoLoader} from "@/components/loader";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip";
import {useQueryState} from "nuqs";
import {addFeaturedLane} from "@/services/mutations/lane/add.featured";
import {useState} from "react";

interface LearnCardProps {
    lane: Lane;
}

export default function LearnCard({lane}: LearnCardProps) {
    if (lane.state !== "completed") {
        return (
            <div
                className="hover:shadow-brand-shadow group hover:bg-brand-red/5 relative flex cursor-pointer flex-col rounded-md transition-[box-shadow,background-color] duration-200 ease-in-out">
                {lane.state === "accepted" && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative flex h-[250px] w-full items-center justify-center rounded-md">
                                <Image
                                    src={lane.youtubeDetails.thumbnail}
                                    alt=""
                                    width={1280}
                                    height={720}
                                    className="image-edge h-[250px] w-full rounded-md object-cover object-center opacity-70 blur-xs brightness-50 transition-[border-radius] duration-200 ease-linear group-hover:rounded-t-md group-hover:rounded-b-none"
                                    quality={100}
                                    priority
                                />
                                <div
                                    className="border-brand-grey/60 absolute top-1/2 left-1/2 flex h-[250px] w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-solid group-hover:rounded-t-md group-hover:rounded-b-none">
                                    <LogoLoader size={56} className="text-white"/>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Creating Lane</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {lane.state === "failed" && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative flex h-[250px] w-full items-center justify-center rounded-md">
                                <Image
                                    src={lane.youtubeDetails.thumbnail}
                                    alt=""
                                    width={1280}
                                    height={720}
                                    className="image-edge h-[250px] w-full rounded-md object-cover object-center opacity-70 blur-xs brightness-50 transition-[border-radius] duration-200 ease-linear group-hover:rounded-t-md group-hover:rounded-b-none"
                                    quality={100}
                                    priority
                                />
                                <div
                                    className="border-brand-grey/60 absolute top-1/2 left-1/2 flex h-[250px] w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-solid group-hover:rounded-t-md group-hover:rounded-b-none">
                                    <OctagonAlert
                                        size={64}
                                        className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                                    />
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Failed to recreate lane, please retry</p>
                        </TooltipContent>
                    </Tooltip>
                )}
                <ProgressCardSection lane={lane}/>
            </div>
        );
    }

    return (
        <div
            className="hover:shadow-brand-shadow group hover:bg-brand-red/5 relative flex flex-col gap-1 rounded-md transition-[box-shadow,background-color,gap] duration-200 ease-in-out hover:gap-0"
        >
            <Link
                href={
                    lane.state !== "completed"
                        ? `${appRoutes.dashboard.user.progress}?laneId=${lane.id}`
                        : appRoutes.dashboard.user.challanges(lane.id)
                }
                className="focus-visible:ring-brand-text/25 absolute inset-0 z-0 cursor-pointer rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
                <span className="sr-only">{lane.youtubeDetails.title}</span>
            </Link>

            {lane.state === "completed" && (
                <Link
                    href={
                        lane.state !== "completed"
                            ? `${appRoutes.dashboard.user.progress}?laneId=${lane.id}`
                            : appRoutes.dashboard.user.challanges(lane.id)
                    }
                    className="h-[250px] w-full rounded-md object-cover object-center transition-[border-radius] duration-200 ease-linear group-hover:rounded-t-md group-hover:rounded-b-none overflow-hidden"
                >
                    <Image
                        src={lane.youtubeDetails.thumbnail}
                        alt=""
                        width={1280}
                        height={720}
                        className="image-edge h-[250px] w-full rounded-md object-cover object-center transition-[border-radius,scale] duration-200 ease-linear group-hover:rounded-t-md group-hover:rounded-b-none motion-safe:group-hover:scale-105"
                        quality={100}
                        priority
                    />
                </Link>
            )}

            <ProgressCardSection lane={lane}/>
        </div>
    );
}

const ProgressCardSection = ({lane}: LearnCardProps) => {
    const queryClient = useQueryClient();
    const [activeTab] = useQueryState("tab");
    const [isRetrying, setIsRetrying] = useState(false);

    const removeLaneM = useMutation({
        mutationFn: (laneId: string) => removeLane({laneId}),
        onError: (error) => {
            toast.error((error.message as string) || "Failed to remove lane");
        },
    });

    const addFeaturedToLaneM = useMutation({
        mutationFn: (laneId: string) => addFeaturedLane({laneId}),
        onError: (error) => {
            toast.error((error.message as string) || "Failed to add lane");
        },
    });

    async function handleRemove(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!lane.id) {
            toast.error("Missing lane ID");
            return;
        }

        try {
            const res = await removeLaneM.mutateAsync(lane.id);

            if (res === "success") {
                toast.success("Lane removed successfully!");
                await queryClient.invalidateQueries({queryKey: ["get-lanes"]});
            }
        } catch (error) {
            toast.error((error as string) || "Failed to remove lane");
        }
    }

    const redoLaneM = useMutation({
        mutationFn: (laneId: string) => redoLane({laneId}),
        onError: (error) => {
            toast.error((error.message as string) || "Failed to retry lane");
        },
    });

    async function handleRetry(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsRetrying(true);

        if (!lane.id) {
            toast.error("Missing lane ID");
            return;
        }

        try {
            const res = await redoLaneM.mutateAsync(lane.id);

            if (res.message === "success") {
                toast.success("Lane retry initiated!");
                await queryClient.invalidateQueries({queryKey: ["get-lanes"]});
            }
        } catch (error) {
            toast.error((error as string) || "Failed to retry lane");
        } finally {
            setIsRetrying(false);
        }
    }

    async function handleAddToFeatured(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!lane.id) {
            toast.error("Missing lane ID");
            return;
        }

        try {
            const res = await addFeaturedToLaneM.mutateAsync(lane.id);

            if (res === "success") {
                toast.success("Lane added to featured successfully!");
                await queryClient.invalidateQueries({
                    queryKey: ["get-featured-lanes"],
                });
            }
        } catch (error) {
            toast.error((error as string) || "Failed to add lane");
        }
    }

    const total = Number(lane.totalChallenges) || 0;
    const passed = Number(lane.challengesPassed) || 0;
    const percent = total > 0 ? Math.min(100, (passed / total) * 100) : 0;

    return (
        <div className="flex w-full flex-col pb-2">
            {/* Progress rides the bottom edge of the thumbnail rather than sitting
          beside the title as a ring. A ring has to be big enough to hold a
          label, which cost the title a 70px bite of every card; a rule reads
          as "how far along this lane is" at a glance from across a grid, and
          the exact count moves down to the meta line where the other facts
          about the lane already live. */}
            {total > 0 && (
                <div
                    role="progressbar"
                    aria-valuenow={passed}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-label={`${passed} of ${total} challenges cleared`}
                    className="bg-brand-text/15 h-1 w-full shrink-0 overflow-hidden rounded-full group-hover:rounded-none"
                >
                    <div
                        className="bg-brand-red h-full rounded-full group-hover:rounded-none transition-[width] duration-500 ease-out"
                        style={{width: `${percent}%`}}
                    />
                </div>
            )}

            <div className="mt-1 flex w-full items-start justify-between gap-3">
                <div className="ml-2 flex min-w-0 flex-col gap-1">
                    <p className="line-clamp-1 text-lg font-black md:text-xl">
                        {lane.youtubeDetails.title}
                    </p>

                    <div className="text-brand-text/60 flex items-center gap-2 text-xs md:text-sm">
                        {total > 0 && (
                            <>
                <span className="text-brand-text font-semibold tabular-nums whitespace-nowrap">
                  {passed}/{total} done
                </span>
                                <MetaDot/>
                            </>
                        )}

                        <span className="tabular-nums whitespace-nowrap">
              {lane.totalAttempts} Attempts
            </span>

                        <MetaDot/>

                        <span className="line-clamp-1 capitalize">
              {dateToNow(lane.updatedAt)}
            </span>
                    </div>
                </div>

                {activeTab !== "featured" && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            aria-label="Lane options"
                            className="hover:bg-brand-black/5 text-brand-text/55 hover:text-brand-text focus-visible:ring-brand-text/25 relative z-10 my-1 mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none">
                            <EllipsisVertical aria-hidden className="size-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32" align="end">
                            <DropdownMenuGroup>
                                {lane.state != "accepted" && (
                                    <>
                                        <DropdownMenuItem
                                            disabled={
                                                redoLaneM.isPending || lane.state === "accepted"
                                            }
                                            onClick={handleRetry}
                                            className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
                                        >
                                            {isRetrying || lane.state === "accepted"
                                                ? "Recreating..."
                                                : "Recreate Lane"}
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator/>
                                    </>
                                )}

                                <DropdownMenuItem
                                    disabled={removeLaneM.isPending}
                                    onClick={handleRemove}
                                    className="hover:!bg-primary dark:hover:!bg-primary [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
                                >
                                    {removeLaneM.isPending ? "Removing..." : "Remove Lane"}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {activeTab === "featured" && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            aria-label="Lane options"
                            className="hover:bg-brand-black/5 text-brand-text/55 hover:text-brand-text focus-visible:ring-brand-text/25 relative z-10 my-1 mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none">
                            <EllipsisVertical aria-hidden className="size-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32" align="center">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    disabled={addFeaturedToLaneM.isPending}
                                    onClick={handleAddToFeatured}
                                    className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
                                >
                                    Add to Lanes
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
};

/** Separator between facts on the card's meta line. */
const MetaDot = () => (
    <span aria-hidden className="bg-brand-text/25 size-1 shrink-0 rounded-full"/>
);
