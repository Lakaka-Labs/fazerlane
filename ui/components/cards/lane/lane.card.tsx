"use client";

import { removeLane } from "@/api/mutations/lane/delete";
import { redoLane } from "@/api/mutations/lane/redo";
import { CircularProgress } from "@/components/progress-09";
import appRoutes from "@/config/routes";
import { Lane } from "@/types/api/lane";
import { dateToNow } from "@/utils/date-to-now";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dot, LoaderCircle, RotateCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LearnCardProps {
  lane: Lane;
}

export default function LearnCard({ lane }: LearnCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const removeLaneM = useMutation({
    mutationFn: (laneId: string) => removeLane({ laneId }),
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
      href={appRoutes.dashboard.user.challanges(lane.id)}
      className="border-brand-border shadow-brand-shadow group relative flex cursor-pointer flex-col gap-3 rounded-md border border-solid"
    >
      <div
        aria-disabled={redoLaneM.isPending}
        onClick={handleRetry}
        className="bg-brand-white text-brand-red border-brand-black absolute top-3 left-3 z-10 flex h-fit w-fit cursor-pointer items-center justify-center rounded-md border border-solid p-2 opacity-0 backdrop-blur-md transition-all duration-200 ease-linear group-hover:opacity-100"
      >
        {redoLaneM.isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <RotateCcw />
        )}
      </div>

      <div
        aria-disabled={removeLaneM.isPending}
        onClick={handleRemove}
        className="bg-brand-white text-brand-red border-brand-black absolute top-3 right-3 z-10 flex h-fit w-fit cursor-pointer items-center justify-center rounded-md border border-solid p-2 opacity-0 backdrop-blur-md transition-all duration-200 ease-linear group-hover:opacity-100"
      >
        {removeLaneM.isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Trash2 />
        )}
      </div>

      <Image
        src={lane.youtubeDetails.thumbnail}
        alt="img"
        width={1280}
        height={720}
        className="h-[210px] w-full rounded-t-md object-cover object-center"
        quality={100}
        priority
      />

      <div className="flex w-full justify-between pb-3">
        <div className="flex w-full items-center justify-between gap-3 pl-4">
          <div className="flex flex-col gap-1">
            <p className="line-clamp-1 text-xl font-black">
              {lane.youtubeDetails.title}
            </p>

            <div className="flex items-center gap-px text-sm">
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
      </div>
    </Link>
  );
}
