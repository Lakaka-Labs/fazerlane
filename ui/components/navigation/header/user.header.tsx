import appRoutes from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import HeaderAvatar from "./avatar.client";

export default function UserHeader() {
  return (
    <Dialog>
      <div className="px-xLayout relative z-10 flex h-[70px] w-full items-center justify-between">
        <Link
          href={appRoutes.dashboard.user.lanes}
          className="flex items-center gap-2 text-2xl font-normal uppercase"
        >
          <Image
            src={"/brand/favicon.svg"}
            alt="Fazerlane logo"
            width={34}
            height={34}
          />
        </Link>
        <span className="text-brand-black font-sf-pro-display text-lg font-normal tracking-widest uppercase">
          Fazerlane
        </span>

        <HeaderAvatar />
      </div>
    </Dialog>
  );
}
