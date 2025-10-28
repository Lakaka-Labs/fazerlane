"use client";

import { WebSocketManager } from "@/config/socket";
import { ChallengeEvent } from "@/types/events/lane";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthTitle from "@/components/title/auth.title";
import Hyperspeed from "@/components/Hyperspeed";
import { hyperSpeedEffectOptions, HyperSpeedEffectOptions } from "@/lib/effect";
import TextSeperator from "@/components/seperator/seperator-with-text";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import appRoutes, { WS_BASE_URL } from "@/config/routes";
import { useQueryState } from "nuqs";
import { useMutation } from "@tanstack/react-query";
import { redoLane } from "@/api/mutations/lane/redo";
import { removeLane } from "@/api/mutations/lane/delete";

export default function ChallengeProgress() {
  const router = useRouter();
  const [laneId] = useQueryState("laneId");
  const [progress, setProgress] = useState<ChallengeEvent | null>(null);
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);

  const [showRetry, setShowRetry] = useState(false);

  const redoLaneM = useMutation({
    mutationFn: (laneId: string) => redoLane({ laneId }),
  });

  const removeLaneM = useMutation({
    mutationFn: (laneId: string) => removeLane({ laneId }),
  });

  async function handleRetry() {
    if (!laneId) {
      toast.error("Missing lane ID");
      return;
    }

    try {
      const res = await redoLaneM.mutateAsync(laneId);

      if (res.message === "success") {
        toast.success("Lane retry initiated!");
        wsManager?.disconnect();
        router.push(
          `${appRoutes.dashboard.user.progress}?laneId=${res.data.laneId}`
        );
      }
    } catch (error) {
      toast.error((error as string) || "Failed to retry lane");
    }
  }

  async function handleRemove() {
    if (!laneId) {
      toast.error("Missing lane ID");
      return;
    }

    try {
      const res = await removeLaneM.mutateAsync(laneId);

      if (res === "success") {
        toast.success("Lane removed successfully!");
        wsManager?.disconnect();
        router.push(appRoutes.dashboard.user.lanes);
      }
    } catch (error) {
      toast.error((error as string) || "Failed to remove lane");
    }
  }

  useEffect(() => {
    const manager = new WebSocketManager({
      url: `${WS_BASE_URL}/progress/${laneId}`,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      onOpen: (event) => {
        console.log("Connected to progress WebSocket", event);
      },
      onMessage: (data: ChallengeEvent) => {
        console.log(`Progress update: `, data);

        if (!laneId) {
          toast.error("Missing lane ID");
          router.push(appRoutes.dashboard.user.lanes);
          return;
        }

        setProgress(data);

        console.log("socket data", data);

        if (data.message === "completed") {
          toast.success("Lane created successfully!");
          // manager.disconnect();
          router.push(appRoutes.dashboard.user.challanges(laneId));
        }
      },
      onClose: (event) => {
        console.log("WebSocket connection closed", event);
      },
      onReconnect: (attempt) => {
        console.log(`Reconnecting... Attempt ${attempt}`);
      },
    });

    manager.connect();
    setWsManager(manager);

    return () => {
      manager.disconnect();
    };
  }, [laneId, router]);

  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className={`fixed top-0 left-0 z-[0] h-screen w-screen overflow-hidden`}
      >
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex w-full max-w-md flex-col gap-5 rounded-md border border-solid border-gray-500/20 bg-white/5 px-8 pt-10 pb-8 text-center shadow-2xl backdrop-blur-md"
        >
          <AuthTitle title="Creating Your Lane!" />

          {(progress.message === "generating" ||
            progress.message === "regenerating") && (
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            </div>
          )}

          <p className="text-base font-semibold uppercase">
            [ {progress.message} ]
          </p>

          {progress.message === "failed" && (
            <p className="text-center font-medium">
              Failed to create lane.{" "}
              <button
                onClick={() => setShowRetry(true)}
                className="text-primary cursor-pointer font-semibold"
              >
                Retry
              </button>
            </p>
          )}

          {showRetry && (
            <Button
              disabled={redoLaneM.isPending}
              onClick={handleRetry}
              className="flex-1 rounded-[6px] bg-black px-4 hover:bg-black/50"
            >
              {redoLaneM.isPending ? "Retrying" : "Retry Lane"}
            </Button>
          )}

          <TextSeperator text="OR" />

          <Button
            disabled={removeLaneM.isPending}
            onClick={handleRemove}
            type="submit"
            className=""
          >
            {removeLaneM.isPending ? "Removing" : "Delete Lane"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
