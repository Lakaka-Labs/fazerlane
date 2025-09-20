import { PersistMainStoreActions, PersistMainStoreState } from "@/types/store";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type PersistMainStore = PersistMainStoreState & PersistMainStoreActions;

export const defaultInitState: PersistMainStoreState = {
  count: 0,
};

export const createPersistMainStore = (
  initState: PersistMainStoreState = defaultInitState
) => {
  return createStore<PersistMainStore>()(
    persist(
      (set, _get) => ({
        ...initState,
        decrementCount: () => set((state) => ({ count: state.count - 1 })),
        incrementCount: () => set((state) => ({ count: state.count + 1 })),
      }),
      {
        name: "fazerlane_persisted_store",
      }
    )
  );
};
