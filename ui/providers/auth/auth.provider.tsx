"use client";

import { PageLoader } from "@/components/loader";
import { useAuthListener } from "@/composables/useAuthListener";
import { PropsWithChildren, Suspense } from "react";

export default function UAuthProvider({ children }: PropsWithChildren) {
  useAuthListener();
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}
