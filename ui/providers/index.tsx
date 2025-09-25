import { PropsWithChildren } from "react";
import TQueryClientProvider from "./tanstack";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <TQueryClientProvider>{children}</TQueryClientProvider>
    </NuqsAdapter>
  );
}
