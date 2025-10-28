import { Challenge } from "@/types/api/challenges";
import { PersistMainStoreActions, PersistMainStoreState } from "@/types/store";
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
  showChatbot: false,
};

export const persistStore = createStore<PersistMainStore>()(
  persist(
    (set, _get) => ({
      ...defaultInitState,
      setSession: (session) => set(() => ({ session })),
      setUser: (user) => set(() => ({ user })),
      setToken: (token) => set(() => ({ token })),
      setCurrentChellenge: (lane: Challenge | null) =>
        set({ currentChallenge: lane }),
      setClear: () => set(() => ({ ...defaultInitState })),
      setShowChatbot: (show: boolean) => set({ showChatbot: show }),
    }),
    {
      name: "fazerlane_persisted_store",
    }
  )
);

export const usePersistStore = <T>(
  selector: (state: PersistMainStore) => T
): T => useStore(persistStore, selector);
