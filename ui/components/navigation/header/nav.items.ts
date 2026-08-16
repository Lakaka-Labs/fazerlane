import type { LucideIcon } from "lucide-react";
import { Route, Settings } from "lucide-react";

import appRoutes from "@/config/routes";

/**
 * The header's destinations, declared once and consumed by both the bar and the
 * account menu, so the two can't disagree about what the app's sections are or
 * about which one you're standing in.
 *
 * `/u/lanes/progress` is deliberately absent: it is a transient screen that a
 * freshly created lane parks you on until the worker finishes, not somewhere
 * you'd choose to go.
 */
export interface HeaderNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown in the bar's tooltip — says what's behind the label. */
  description: string;
  /** Extra path prefixes that still count as being inside this section. */
  matches?: string[];
}

/** Route prefix of a lane's challenge workspace. */
export const CHALLENGES_PREFIX = "/u/challanges";

export const headerNavItems: HeaderNavItem[] = [
  {
    label: "Lanes",
    href: appRoutes.dashboard.user.lanes,
    icon: Route,
    description: "Your lanes and the featured library",
    // A lane's challenge workspace and the creation screen are both downstream
    // of Lanes, so the section stays lit while you're inside them — the bar
    // should never go blank about where you are.
    matches: [CHALLENGES_PREFIX],
  },
  {
    label: "Settings",
    href: appRoutes.dashboard.user.settings,
    icon: Settings,
    description: "Profile, custom prompt and API key",
  },
];

export function isNavItemActive(item: HeaderNavItem, pathname: string) {
  return [item.href, ...(item.matches ?? [])].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * The lane id when the current route is a challenge workspace, otherwise
 * `undefined`. Read from the pathname rather than `useParams()` so the header —
 * which renders above the dynamic segment — doesn't depend on where in the tree
 * it happens to sit.
 */
export function getLaneIdFromPath(pathname: string) {
  if (!pathname.startsWith(`${CHALLENGES_PREFIX}/`)) return undefined;

  return pathname.split("/")[3] || undefined;
}
