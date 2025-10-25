"use client";

import { usePersistStore } from "@/store/persist.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderAvatar() {
  const { session } = usePersistStore((state) => state);
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={undefined} />
      <AvatarFallback className="bg-brand-black text-brand-white size-8 uppercase">
        {session?.user?.username?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
