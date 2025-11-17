import { PropsWithChildren } from "react";
import TQueryClientProvider from "./tanstack";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme/theme.provider";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <TQueryClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TQueryClientProvider>
    </NuqsAdapter>
  );
}
