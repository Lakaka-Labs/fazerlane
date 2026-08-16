"use client";

import { UserHeader } from "@/components/navigation/header";
import { UAuthProvider } from "@/providers/auth";
import { SmoothScroll } from "@/providers/smoothscroll";
import { RateLimitPromptDialog } from "@/components/dialog/rate-limit/rate-limit-prompt";
import { PropsWithChildren, useRef } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  const scrollContainerRef = useRef<HTMLElement>(null);

  return (
    <UAuthProvider>
      <div className="bg-background text-foreground/70 lbg-brand-background-dashboard ltext-brand-text">
        <div className="mx-auto h-screen w-full overflow-hidden">
          <div className="relative">
            <UserHeader />
          </div>

          <SmoothScroll>
            {/* Target of the header's skip link. `tabIndex={-1}` lets focus
                actually land here rather than being dropped by the browser.
                A real <main> so the bar stays the page's only banner — a
                page-level <header> nested anywhere outside it would claim that
                role too. */}
            <main
              id="main-content"
              tabIndex={-1}
              ref={scrollContainerRef}
              className="lg:py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto py-0 outline-none"
            >
              {children}
            </main>
          </SmoothScroll>
        </div>
      </div>

      <RateLimitPromptDialog />
    </UAuthProvider>
  );
}
