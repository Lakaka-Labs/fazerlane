import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { persistStore, usePersistStore } from "@/store/persist.store";
import appRoutes from "@/config/routes";

/**
 * Sends an already signed-in visitor from a guest-only page (home, sign in,
 * sign up) to their lanes.
 *
 * The returned flag stays `false` on the server and on the first client render
 * on purpose: until zustand replays localStorage the store still holds
 * `defaultInitState`, so reading the jwt any earlier reports everyone as a
 * guest *and* would make the client markup disagree with the server's. Once
 * hydration finishes the flag flips, giving the caller a frame to show a loader
 * instead of the page the visitor is about to be moved off.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const jwt = usePersistStore((state) => state.session.jwt);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (persistStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return persistStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const isAuthenticated = hydrated && Boolean(jwt);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(appRoutes.dashboard.user.lanes);
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
