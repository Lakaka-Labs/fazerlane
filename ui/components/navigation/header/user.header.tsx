"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import FazerMark from "@/components/brand/fazer-mark";
import appRoutes from "@/config/routes";
import { cn } from "@/lib/utils";

import HeaderAvatar from "./avatar.client";
import LaneCrumb from "./lane.crumb";
import HeaderNavLinks from "./nav.links";
import { getLaneIdFromPath } from "./nav.items";

/**
 * The dashboard's one fixed strip.
 *
 * It reads left to right as identity → place → destinations → account, which is
 * the order those questions actually get asked. The previous bar was a
 * `justify-between` row of three unrelated items, so the wordmark floated at
 * whatever position the flex algorithm produced and there was nowhere to put
 * anything else; a left lockup gives the crumb room to grow and lets the right
 * cluster absorb new destinations without re-centring the brand.
 *
 * The canvas underneath is white, so the bar is white too and separates itself
 * with the same hairline every panel in the app uses rather than with a shadow.
 */
export default function UserHeader() {
  const pathname = usePathname() ?? "";
  const laneId = getLaneIdFromPath(pathname);

  return (
    <header className="border-brand-divider relative z-40 border-b border-solid bg-white">
      <div className="lg:px-xLayout flex h-[70px] w-full items-center gap-2 px-4 sm:gap-3">
        {/* Keyboard users otherwise tab the whole bar before reaching the page. */}
        <a
          href="#main-content"
          className="bg-brand-text text-brand-white focus-visible:ring-brand-text/30 sr-only rounded rounded-tl-lg px-3 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-1/2 focus:left-4 focus:z-50 focus:-translate-y-1/2 focus-visible:ring-2"
        >
          Skip to content
        </a>

        <Link
          href={appRoutes.dashboard.user.lanes}
          aria-label="Fazerlane home"
          // Plain radius: the wordmark is identity, not a control, and the
          // signature corner is reserved for things you press.
          className="group focus-visible:ring-brand-text/25 flex shrink-0 items-center gap-2.5 rounded py-1 focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* Inline rather than an <Image> so the mark inherits the bar's ink
              and can answer the pointer. */}
          <FazerMark
            size={30}
            className="text-brand-text transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:scale-105"
          />

          <span
            className={cn(
              "font-sf-pro-display text-brand-text hidden text-base font-normal tracking-widest uppercase lg:text-lg",
              // Inside a lane the crumb is the more useful thing to spend the
              // narrow widths on, so the wordmark waits for a wider viewport.
              laneId ? "md:inline" : "sm:inline"
            )}
          >
            Fazerlane
          </span>
        </Link>

        <LaneCrumb laneId={laneId} />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <HeaderNavLinks />

          <span
            aria-hidden
            className="bg-brand-divider mx-0.5 hidden h-6 w-px sm:block"
          />

          <HeaderAvatar />
        </div>
      </div>
    </header>
  );
}
