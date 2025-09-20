"use client";

import { PropsWithChildren } from "react";
import TQueryClientProvider from "./tanstack";
import ZustandStoreProvider from "./zustand";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <TQueryClientProvider>
      <ZustandStoreProvider>{children}</ZustandStoreProvider>
    </TQueryClientProvider>
  );
}
