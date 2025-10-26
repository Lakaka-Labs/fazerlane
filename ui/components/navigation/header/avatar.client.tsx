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
import { useRouter } from "next/navigation";
import appRoutes from "@/config/routes";

export default function HeaderAvatar() {
  const router = useRouter();
  const { session, setClear } = usePersistStore((state) => state);

  const handleLogout = () => {
    setClear();

    router.replace(appRoutes.auth.signIn);
  };

  const handleHome = () => {
    router.push(appRoutes.home.index);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={undefined} />
          <AvatarFallback className="bg-brand-black hover:bg-brand-red text-brand-white size-8 uppercase">
            {session?.user?.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="center">
        <DropdownMenuLabel>{session?.user?.username}</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleHome}
            className="hover:!bg-brand-black dark:hover:!bg-brand-black [variant=destructive]:focus:!bg-brand-black [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
          >
            Home
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:!bg-brand-red dark:hover:!bg-brand-red [variant=destructive]:focus:!bg-brand-red [variant=destructive]:focus:text-brand-white hover:text-brand-white dark:hover:text-brand-white"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
