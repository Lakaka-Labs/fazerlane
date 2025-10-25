"use client";

import { useAuthListener } from "@/composables/useAuthListener";
import { PropsWithChildren } from "react";

export default function UAuthProvider({ children }: PropsWithChildren) {
  useAuthListener();
  return <>{children}</>;
}
