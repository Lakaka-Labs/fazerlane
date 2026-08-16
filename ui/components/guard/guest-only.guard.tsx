"use client";

import { PropsWithChildren } from "react";
import { PageLoader } from "@/components/loader";
import { useRedirectIfAuthenticated } from "@/composables/useRedirectIfAuthenticated";

/**
 * Wraps a page that only makes sense for signed-out visitors. Signed-in ones
 * are replaced (not pushed — back shouldn't land them here again) onto their
 * lanes, and see the loader rather than a flash of the page they're leaving.
 */
export default function GuestOnlyGuard({ children }: PropsWithChildren) {
  const isAuthenticated = useRedirectIfAuthenticated();

  if (isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
