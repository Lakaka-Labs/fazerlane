import { Chatbot } from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import appRoutes from "@/config/routes";
import { Bell, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserHeader() {
  return (
    <div className="px-xLayout flex h-[70px] w-full items-center justify-between border-b border-gray-300 shadow-md">
      <Link
        href={appRoutes.home.index}
        className="flex items-center gap-3 text-lg font-semibold"
      >
        <Image
          src={"/brand/favicon.svg"}
          alt="Fazerlane logo"
          width={38}
          height={38}
        />
        <span>Fazerlane</span>
      </Link>

      <Chatbot />

      <div className="flex items-center gap-6">
        <Button className="flex transform items-center gap-1.5 rounded-full bg-gray-300 text-sm !font-semibold text-black shadow-lg transition-colors duration-200 ease-linear hover:bg-gray-600 hover:text-white">
          <Plus scale={24} className="size-5" />
          <span>Create</span>
        </Button>

        <Bell size={24} className="cursor-pointer" />

        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
