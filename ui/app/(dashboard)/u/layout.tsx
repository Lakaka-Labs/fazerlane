"use client";

import { UserHeader } from "@/components/navigation/header";
import { UAuthProvider } from "@/providers/auth";
import { SmoothScroll } from "@/providers/smoothscroll";
import { PropsWithChildren, useRef } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <UAuthProvider>
      <div className="bg-background text-foreground/70 lbg-brand-background-dashboard ltext-brand-text">
        <div className="mx-auto h-screen w-full overflow-hidden">
          <div className="relative">
            <UserHeader />
          </div>

          <SmoothScroll>
            <div
              ref={scrollContainerRef}
              className="lg:py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto py-0"
            >
              {children}
            </div>
          </SmoothScroll>
        </div>
      </div>
    </UAuthProvider>
  );
}
