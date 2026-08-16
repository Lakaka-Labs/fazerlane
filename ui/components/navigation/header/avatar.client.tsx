"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import appRoutes from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { deleteCookie } from "@/utils/cookies";

/**
 * Account menu — who you are signed in as, and the way out.
 *
 * It carries no destinations. Lanes and Settings sit two clicks wide in the bar
 * immediately to its left, and a menu that repeats its neighbour buries the one
 * item that has nowhere else to live. What's left is exactly what the bar can't
 * say: which account this is.
 */
export default function HeaderAvatar() {
  const router = useRouter();
  const { session, setClear } = usePersistStore((state) => state);

  const username = session?.user?.username ?? "";
  const email = session?.user?.email ?? "";
  const initial = (username || email).trim().charAt(0) || "?";

  const handleLogout = () => {
    setClear();
    deleteCookie("token");
    deleteCookie("refreshToken");

    router.replace(appRoutes.auth.signIn);
  };

  return (
    <DropdownMenu>
      {/* Radix derives this id from `useId()`, whose value depends on the
          component's path through the tree. The header sits inside the auth
          Suspense boundary alongside components that suspend during SSR, so
          the server and client passes can land on different paths and emit
          different ids — a hydration mismatch on this attribute alone. A
          stable id sidesteps the generated one entirely. */}
      <DropdownMenuTrigger asChild id="user-menu-trigger">
        <button
          type="button"
          aria-label="Account menu"
          className="group focus-visible:ring-brand-text/25 data-[state=open]:ring-brand-text/25 shrink-0 cursor-pointer rounded-full ring-offset-2 ring-offset-white transition-transform duration-200 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:outline-none data-[state=open]:ring-2"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-text text-brand-white group-hover:bg-brand-deep-black text-xs font-bold uppercase transition-colors duration-200">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="border-brand-divider shadow-brand-shadow w-60 rounded-xl border border-solid p-1.5"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
          <Avatar className="size-9">
            <AvatarFallback className="bg-brand-text text-brand-white text-sm font-bold uppercase">
              {initial}
            </AvatarFallback>
          </Avatar>

          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-brand-text truncate text-sm font-semibold capitalize">
              {username || "Your account"}
            </span>
            {email && (
              <span className="text-brand-text/45 truncate text-xs font-normal">
                {email}
              </span>
            )}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-brand-divider" />

        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-brand-red-50 focus:bg-brand-red/10 focus:text-brand-red-50 cursor-pointer rounded-md px-2 py-2 text-sm font-semibold"
        >
          <LogOut className="size-4 text-current" strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
