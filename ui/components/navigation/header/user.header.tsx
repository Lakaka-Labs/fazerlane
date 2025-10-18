import appRoutes from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserHeader() {
  return (
    <Dialog>
      <div className="px-xLayout flex h-[70px] w-full items-center justify-between">
        <Link
          href={appRoutes.home.index}
          className="flex items-center gap-2 text-2xl font-normal uppercase"
        >
          <Image
            src={"/brand/favicon.svg"}
            alt="Fazerlane logo"
            width={34}
            height={34}
          />
          <span>Fazerlane</span>
        </Link>

        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-brand-black text-brand-white size-8">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </Dialog>
  );
}
