import { PersistMainStoreActions, PersistMainStoreState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
};

export const usePersistStore = create<PersistMainStore>()(
  persist(
    (set, _get) => ({
      ...defaultInitState,
      setSession: (session) => set(() => ({ session })),
      setUser: (user) => set(() => ({ user })),
      setToken: (token) => set(() => ({ token })),
    }),
    {
      name: "fazerlane_persisted_store",
    }
  )
);
