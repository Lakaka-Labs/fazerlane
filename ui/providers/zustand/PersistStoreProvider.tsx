"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type PersistMainStore,
  createPersistMainStore,
} from "@/store/persist.store";

export type PersistMainStoreApi = ReturnType<typeof createPersistMainStore>;

export const PersistMainStoreContext = createContext<
  PersistMainStoreApi | undefined
>(undefined);

export interface PersistMainStoreProviderProps {
  children: ReactNode;
}

export const PersistMainStoreProvider = ({
  children,
}: PersistMainStoreProviderProps) => {
  const storeRef = useRef<PersistMainStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createPersistMainStore();
  }

  return (
    <PersistMainStoreContext.Provider value={storeRef.current}>
      {children}
    </PersistMainStoreContext.Provider>
  );
};

export const usePersistMainStore = <T,>(
  selector: (store: PersistMainStore) => T
): T => {
  const PersistmainStoreContext = useContext(PersistMainStoreContext);

  if (!PersistmainStoreContext) {
    throw new Error(
      `usePersistMainStore must be used within PersistMainStoreProvider`
    );
  }

  return useStore(PersistmainStoreContext, selector);
};
