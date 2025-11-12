"use client";

import { InlineLoader } from "@/components/loader";
import { useAuthListener } from "@/composables/useAuthListener";
import { PropsWithChildren, Suspense } from "react";

export default function UAuthProvider({ children }: PropsWithChildren) {
  useAuthListener();
  return <Suspense fallback={<InlineLoader fill />}>{children}</Suspense>;
}
