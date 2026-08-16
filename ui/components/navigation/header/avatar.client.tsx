"use client";

import { usePersistStore } from "@/store/persist.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import appRoutes from "@/config/routes";
import { deleteCookie } from "@/utils/cookies";

export default function HeaderAvatar() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, setClear } = usePersistStore((state) => state);

  const handleLogout = () => {
    setClear();
    deleteCookie("token");
    deleteCookie("refreshToken");

    router.replace(appRoutes.auth.signIn);
  };

  const handleHome = () => {
    router.push(appRoutes.dashboard.user.lanes);
  };

  const handleProfile = () => {
    router.push(appRoutes.dashboard.user.settings);
  };

  return (
    <>
      <DropdownMenu>
        {/* Radix derives this id from `useId()`, whose value depends on the
            component's path through the tree. The header sits inside the auth
            Suspense boundary alongside components that suspend during SSR, so
            the server and client passes can land on different paths and emit
            different ids — a hydration mismatch on this attribute alone. A
            stable id sidesteps the generated one entirely. */}
        <DropdownMenuTrigger asChild id="user-menu-trigger">
          <Avatar className="cursor-pointer">
            <AvatarImage />
            <AvatarFallback className="bg-brand-black hover:bg-primary text-brand-white size-8 uppercase">
              {session?.user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" align="end">
          <DropdownMenuLabel className="text-brand-grey font-semibold">
            {session?.user?.username}
          </DropdownMenuLabel>

          <DropdownMenuGroup>
            {pathname !== appRoutes.dashboard.user.lanes && (
              <DropdownMenuItem
                onClick={handleHome}
                className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
              >
                Home
              </DropdownMenuItem>
            )}
            {pathname !== appRoutes.dashboard.user.settings && (
              <DropdownMenuItem
                onClick={handleProfile}
                className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
              >
                Settings
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:!bg-primary dark:hover:!bg-primary [variant=destructive]:focus:!bg-primary [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
