"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { headerNavItems, isNavItemActive } from "./nav.items";

/**
 * The oversized corner is the app's one shape signature, and it means a single
 * thing: **press me.** It belongs to `<Button />` and to control-shaped things
 * like these links — never to the surfaces that merely hold them. A dialog, a
 * menu panel, an icon tile or a status badge wearing a button's corner is a
 * container that lies about what it is, and once everything wears it the mark
 * stops marking anything.
 *
 * Across a run of controls the corner brackets the *run* rather than repeating
 * on each one — leading item top-left, trailing item top-right — so the pair
 * reads as one object instead of two things that happen to be adjacent. Same
 * rule the challenge workspace's chip groups follow, and the same class
 * strings, so a corner means the same thing wherever you meet it.
 */
const navCorners = {
  solo: "rounded rounded-tl-lg",
  start: "rounded rounded-tl-lg",
  middle: "rounded",
  end: "rounded rounded-tr-lg",
} as const;

function cornerFor(index: number, length: number) {
  if (length === 1) return navCorners.solo;
  if (index === 0) return navCorners.start;
  if (index === length - 1) return navCorners.end;

  return navCorners.middle;
}

interface Indicator {
  left: number;
  width: number;
  radii: {
    borderTopLeftRadius: string;
    borderTopRightRadius: string;
    borderBottomLeftRadius: string;
    borderBottomRightRadius: string;
  };
}

/**
 * Top-level section switcher.
 *
 * Deliberately a *pill*, not an underline. Both tabbed surfaces in the app —
 * the lanes tabs and the challenge tabs — mark their selection with a sliding
 * underline, and on `/u/lanes` that row sits directly beneath this one. A
 * second underline 40px above the first would read as one confused tab strip,
 * so global navigation gets its own indicator and the underline stays the
 * page's. The tint is the same `brand-text/[0.07]` the lane sidebar uses for its
 * selected row.
 *
 * Red is not used here on purpose: in this app red means "the challenge you are
 * on", and a section is a coarser thing than that.
 *
 * The pill is one persistent element that travels rather than one per link
 * swapped in and out, so it can carry its corner across the gap: it leaves the
 * leading item bracketing top-left and arrives at the trailing item bracketing
 * top-right, morphing on the way. It reads its radii off whichever link it is
 * sitting on, so the shape can never fall out of step with the classes above.
 *
 * Moved with a plain CSS transition rather than a layout animation: the
 * geometry is already measured here, so a library would only add a second
 * source of truth for the same numbers — and the corner morph has to run on the
 * same clock as the travel, which one transition on one element guarantees.
 */
export default function HeaderNavLinks() {
  const pathname = usePathname() ?? "";

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  const activeItem = headerNavItems.find((item) =>
    isNavItemActive(item, pathname)
  );
  const activeHref = activeItem?.href;

  // Not `useLayoutEffect`: this component still renders on the server, and the
  // frame before the pill is placed costs nothing because a freshly inserted
  // element doesn't transition from its first style anyway.
  useEffect(() => {
    const nav = navRef.current;
    const el = activeHref ? itemRefs.current[activeHref] : null;

    if (!nav || !el) {
      setIndicator(null);
      return;
    }

    const measure = () => {
      const style = getComputedStyle(el);

      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
        radii: {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        },
      });
    };

    measure();

    // The labels drop below `sm` and the webfont lands after first paint, so
    // the item's width is not final at mount.
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    observer.observe(el);

    return () => observer.disconnect();
  }, [activeHref]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="relative flex items-center gap-0.5 sm:gap-1"
    >
      {indicator && (
        <span
          aria-hidden
          className="bg-brand-text/[0.07] pointer-events-none absolute inset-y-0 left-0 transition-[transform,width,border-radius] duration-300 ease-[cubic-bezier(0.34,1.28,0.64,1)] motion-reduce:transition-none"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
            ...indicator.radii,
          }}
        />
      )}

      {headerNavItems.map((item, index) => {
        const isActive = item.href === activeHref;

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                ref={(el) => {
                  itemRefs.current[item.href] = el;
                }}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-2.5 py-2 text-sm transition-colors duration-200 ease-out sm:px-3",
                  "focus-visible:ring-brand-text/25 focus-visible:ring-2 focus-visible:outline-none",
                  cornerFor(index, headerNavItems.length),
                  isActive
                    ? "text-brand-text font-semibold"
                    : "text-brand-text/45 hover:text-brand-text hover:bg-brand-text/[0.035] font-normal"
                )}
              >
                <item.icon
                  className="size-4"
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                {/* Below `sm` the bar gives its width to the lane crumb, so the
                    labels drop and the icons carry the meaning. */}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </TooltipTrigger>

            <TooltipContent side="bottom" sideOffset={6}>
              <p>{item.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
