"use client";

import { PropsWithChildren } from "react";
import TQueryClientProvider from "./tanstack";

export default function AppProvider({ children }: PropsWithChildren) {
  return <TQueryClientProvider>{children}</TQueryClientProvider>;
}
