import { Challenge } from "@/types/api/challenges";
import { PersistMainStoreActions, PersistMainStoreState } from "@/types/store";
// import { create } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { useStore } from "zustand";

export type PersistMainStore = PersistMainStoreState & PersistMainStoreActions;

export const defaultInitState: PersistMainStoreState = {
  user: {
    id: "",
    email: "",
    username: "",
    password: "",
    emailVerified: false,
    createdAt: "",
    updatedAt: "",
  },
  token: {
    jwt: "",
    refreshToken: undefined,
  },
  session: {
    jwt: "",
    refreshToken: undefined,
    user: {
      id: "",
      email: "",
      username: "",
      password: "",
      emailVerified: false,
      createdAt: "",
      updatedAt: "",
    },
  },

  currentChallenge: null,
  currentChallengeId: null,
  currentChallengeTab: "details",
};

export const persistStore = createStore<PersistMainStore>()(
  persist(
    (set, _get) => ({
      ...defaultInitState,
      setSession: (session) => set(() => ({ session })),
      setUser: (user) => set(() => ({ user })),
      setToken: (token) => set(() => ({ token })),
      setCurrentChellenge: (lane: Challenge) => set({ currentChallenge: lane }),
      setCurrentChellengeId: (id: string) => set({ currentChallengeId: id }),
      setCurrentChallengeTab: (tab: string) =>
        set({ currentChallengeTab: tab }),
      setClear: () => set(() => ({ ...defaultInitState })),
    }),
    {
      name: "fazerlane_persisted_store",
    }
  )
);

export const usePersistStore = <T>(
  selector: (state: PersistMainStore) => T
): T => useStore(persistStore, selector);
