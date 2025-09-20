import { MainStoreActions, MainStoreState } from "@/types/store";
import { createStore } from "zustand/vanilla";

export type MainStore = MainStoreState & MainStoreActions;

export const defaultInitState: MainStoreState = {
  count: 0,
};

export const createMainStore = (
  initState: MainStoreState = defaultInitState
) => {
  return createStore<MainStore>()((set, _get) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }));
};
