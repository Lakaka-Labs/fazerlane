import { UserHeader } from "@/components/navigation/header";
import { PropsWithChildren } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <UserHeader />
      <div className="px-xLayout py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
