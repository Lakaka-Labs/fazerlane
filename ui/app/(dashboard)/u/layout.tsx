"use client";

import { UserHeader } from "@/components/navigation/header";
import { UAuthProvider } from "@/providers/auth";
import { SmoothScroll } from "@/providers/smoothscroll";
import { PropsWithChildren, useRef } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <UAuthProvider>
      <div className="bg-brand-background-dashboard text-brand-text">
        <div className="max-w-dashmw mx-auto h-screen w-full overflow-hidden">
          <div className="relative">
            <UserHeader />
          </div>

          <SmoothScroll>
            <div
              ref={scrollContainerRef}
              className="px-xLayout py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto"
            >
              {children}
            </div>
          </SmoothScroll>
        </div>
      </div>
    </UAuthProvider>
  );
}
