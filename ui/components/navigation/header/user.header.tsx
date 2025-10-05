import { Chatbot } from "@/components/chatbot";
import appRoutes from "@/config/routes";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Dialog } from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateChallengeDialog } from "@/components/dialog/challenge";

export default function UserHeader() {
  return (
    <Dialog>
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
          <CreateChallengeDialog />

          <Bell size={24} className="cursor-pointer" />

          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Dialog>
  );
}
