import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/store/persist.store";
import toast from "react-hot-toast";
import appRoutes from "@/config/routes";

export function useAuthListener() {
  const router = useRouter();
  const { setClear } = usePersistStore((state) => state);

  useEffect(() => {
    const handleLogout = () => {
      toast.error("Session expired. Please login again.");
      setClear();

      router.replace(appRoutes.auth.signIn);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [router]);
}
