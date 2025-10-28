"use client";

import { WebSocketManager } from "@/config/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthTitle from "@/components/title/auth.title";
import Hyperspeed from "@/components/Hyperspeed";
import { hyperSpeedEffectOptions, HyperSpeedEffectOptions } from "@/lib/effect";
import TextSeperator from "@/components/seperator/seperator-with-text";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import appRoutes, { queryStateParams, WS_BASE_URL } from "@/config/routes";
import { useQueryState } from "nuqs";
import { useMutation } from "@tanstack/react-query";
import { redoLane } from "@/api/mutations/lane/redo";
import { removeLane } from "@/api/mutations/lane/delete";

export default function ChallengeProgress() {
  const router = useRouter();
  const [laneId] = useQueryState(queryStateParams.laneId);
  const [progress, setProgress] = useState<string>("");
  const [showRetry, setShowRetry] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const isNavigatingRef = useRef(false);

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

        if (wsManagerRef.current) {
          wsManagerRef.current.disconnect();
          wsManagerRef.current = null;
        }

        window.location.href = `${appRoutes.dashboard.user.progress}?laneId=${res.data.laneId}`;
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

        if (wsManagerRef.current) {
          wsManagerRef.current.disconnect();
          wsManagerRef.current = null;
        }

        router.push(appRoutes.dashboard.user.lanes);
      }
    } catch (error) {
      toast.error((error as string) || "Failed to remove lane");
    }
  }

  const handleMessage = useCallback(
    (response: any) => {
      console.log(`Progress update (raw): `, response);

      // Handle both message formats from backend:
      // Format 1 (initial): { id, lane, message, type, createdAt }
      // Format 2 (updates): { data: { lane, message, type } }
      let message: string;

      if (response.data && typeof response.data === "object") {
        message = response.data.message;
        console.log("Using nested data format, message:", message);
      } else if (response.message) {
        message = response.message;
        console.log("Using direct format, message:", message);
      } else {
        console.error("Unknown message format:", response);
        return;
      }

      setProgress(message);

      if (message === "completed") {
        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
          toast.success("Lane created successfully!");

          if (wsManagerRef.current) {
            wsManagerRef.current.disconnect();
            wsManagerRef.current = null;
          }

          setTimeout(() => {
            router.push(appRoutes.dashboard.user.challanges(laneId!));
          }, 100);
        }
      } else if (message === "failed") {
        setShowRetry(true);
      }
    },
    [router, laneId]
  );

  useEffect(() => {
    if (!laneId) {
      toast.error("Missing lane ID");
      router.push(appRoutes.dashboard.user.lanes);
      return;
    }

    if (wsManagerRef.current) {
      console.warn("WebSocket already exists, skipping creation");
      return;
    }

    const manager = new WebSocketManager({
      url: `${WS_BASE_URL}/progress/${laneId}`,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      onOpen: (event) => {
        console.log("Connected to progress WebSocket", event);
        setIsInitializing(false);
      },
      onMessage: handleMessage,
      onClose: (event) => {
        console.log("WebSocket connection closed", event);

        // If closed unexpectedly and not navigating, show error
        if (
          !isInitializing &&
          !isNavigatingRef.current &&
          event.code !== 1000
        ) {
          toast.error("Connection lost. Please refresh the page.");
        }
      },
      onReconnect: (attempt) => {
        console.log(`Reconnecting... Attempt ${attempt}`);
        toast.loading(`Reconnecting... (${attempt}/5)`);
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
        setIsInitializing(false);
      },
    });

    manager.connect();
    wsManagerRef.current = manager;

    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
    };
  }, [laneId]);

  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className={`fixed top-0 left-0 z-[0] h-screen w-screen overflow-hidden`}
      >
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      {isInitializing && !progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex w-full max-w-md flex-col gap-5 rounded-md border border-solid border-gray-500/20 bg-white/5 px-8 pt-10 pb-8 text-center shadow-2xl backdrop-blur-md"
        >
          <AuthTitle title="Connecting..." />
          <div className="flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-red-500" />
          </div>
        </motion.div>
      )}

      {(!isInitializing || progress) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex w-full max-w-md flex-col gap-5 rounded-md border border-solid border-gray-500/20 bg-white/5 px-8 pt-10 pb-8 text-center shadow-2xl backdrop-blur-md"
        >
          <AuthTitle title="Creating Your Lane!" />

          {(progress === "generating" || progress === "regenerating") && (
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            </div>
          )}

          <p className="text-base font-semibold uppercase">[ {progress} ]</p>

          {progress === "failed" && (
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
