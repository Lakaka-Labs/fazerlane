"use client";

import { removeLane } from "@/api/mutations/lane/delete";
import { redoLane } from "@/api/mutations/lane/redo";
import { CircularProgress } from "@/components/progress-09";
import appRoutes from "@/config/routes";
import { Lane } from "@/types/api/lane";
import { dateToNow } from "@/utils/date-to-now";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dot,
  EllipsisVertical,
  LoaderCircle,
  OctagonAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LearnCardProps {
  lane: Lane;
}

export default function LearnCard({ lane }: LearnCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const removeLaneM = useMutation({
    mutationFn: (laneId: string) => removeLane({ laneId }),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to remove lane");
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
        await queryClient.invalidateQueries({ queryKey: ["get-lanes"] });
      }
    } catch (error) {
      toast.error((error as string) || "Failed to remove lane");
    }
  }

  const redoLaneM = useMutation({
    mutationFn: (laneId: string) => redoLane({ laneId }),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to retry lane");
    },
  });

  async function handleRetry(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!lane.id) {
      toast.error("Missing lane ID");
      return;
    }

    try {
      const res = await redoLaneM.mutateAsync(lane.id);

      if (res.message === "success") {
        toast.success("Lane retry initiated!");
        await queryClient.invalidateQueries({ queryKey: ["get-lanes"] });
        router.push(
          `${appRoutes.dashboard.user.progress}?laneId=${res.data.laneId}`
        );
      }
    } catch (error) {
      toast.error((error as string) || "Failed to retry lane");
    }
  }

  return (
    <Link
      href={
        lane.state !== "completed"
          ? `${appRoutes.dashboard.user.progress}?laneId=${lane.id}`
          : appRoutes.dashboard.user.challanges(lane.id)
      }
      className="hover:shadow-brand-shadow group hover:bg-brand-red/5 relative flex transform cursor-pointer flex-col gap-2 rounded-md transition-all duration-200 ease-in-out md:gap-3"
    >
      {lane.state === "completed" && (
        <Image
          src={lane.youtubeDetails.thumbnail}
          alt="img"
          width={1280}
          height={720}
          className="h-[250px] w-full transform rounded-md object-cover object-center transition-all duration-200 ease-linear group-hover:rounded-t-md group-hover:rounded-b-none"
          quality={100}
          priority
        />
      )}

      {lane.state === "accepted" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[250px] w-full items-center justify-center rounded-md">
              <LoaderCircle size={64} className="text-primary animate-spin" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Recreating Lane</p>
          </TooltipContent>
        </Tooltip>
      )}

      {lane.state === "failed" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[250px] w-full items-center justify-center rounded-md">
              <OctagonAlert size={64} className="text-primary animate-pulse" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Failed to recreate lane, please retry</p>
          </TooltipContent>
        </Tooltip>
      )}

      <div className="flex w-full pb-2 md:pb-3">
        <div className="flex w-full items-center justify-between gap-3 pl-4">
          <div className="flex flex-col gap-1">
            <p className="line-clamp-1 text-lg font-black md:text-xl">
              {lane.youtubeDetails.title}
            </p>

            <div className="flex items-center gap-px text-xs md:text-sm">
              <span>{lane.totalAttempts} Attempts</span>
              <Dot />
              <span className="capitalize">{dateToNow(lane.updatedAt)}</span>
            </div>
          </div>

          <div>
            <CircularProgress
              value={
                Number(lane.totalChallenges) > 0
                  ? (Number(lane.challengesPassed) /
                      Number(lane.totalChallenges)) *
                    100
                  : 0
              }
              size={70}
              strokeWidth={6}
              circleStrokeWidth={6}
              progressStrokeWidth={6}
              showLabel
              labelClassName="text-[10px] font-extrabold"
              renderLabel={(_progress) =>
                `${
                  Number(lane.totalChallenges) > 0
                    ? `${Number(lane.challengesPassed)} /
                      ${Number(lane.totalChallenges)}`
                    : `0 / 0`
                }`
              }
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="my-1 mr-2">
            <EllipsisVertical className="hover:bg-brand-black/5 flex size-3.5 min-h-fit min-w-fit shrink-0 rounded-full p-1.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="center">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleRetry}
                className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
              >
                Retry Lane
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemove}
                className="hover:!bg-primary dark:hover:!bg-primary [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
              >
                Remove Lane
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
