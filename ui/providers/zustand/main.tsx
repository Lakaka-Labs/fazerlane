import { PropsWithChildren } from "react";
import { MainStoreProvider } from "./MainStoreProvider";
import { PersistMainStoreProvider } from "./PersistStoreProvider";

export default function ZustandStoreProvider({ children }: PropsWithChildren) {
  return (
    <PersistMainStoreProvider>
      <MainStoreProvider>{children}</MainStoreProvider>
    </PersistMainStoreProvider>
  );
}
