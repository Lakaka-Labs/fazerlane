"use client";

import { UserHeader } from "@/components/navigation/header";
import { UAuthProvider } from "@/providers/auth";
import { SmoothScroll } from "@/providers/smoothscroll";
// import { WebSocketProvider } from "@/providers/socket/raw";
// import { usePersistStore } from "@/store/persist.store";
import { PropsWithChildren, useRef } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const { socketLaneId } = usePersistStore((state) => state);

  return (
    <UAuthProvider>
      {/* <WebSocketProvider laneId={socketLaneId}> */}
      <div className="bg-brand-background-dashboard text-brand-text">
        <div className="mx-auto h-screen w-full overflow-hidden">
          <div className="relative">
            <UserHeader />
          </div>

          <SmoothScroll>
            <div
              ref={scrollContainerRef}
              className="py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto"
            >
              {children}
            </div>
          </SmoothScroll>
        </div>
      </div>
      {/* </WebSocketProvider> */}
    </UAuthProvider>
  );
}
