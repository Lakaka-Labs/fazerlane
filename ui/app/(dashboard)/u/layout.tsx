import { UserHeader } from "@/components/navigation/header";
import { PropsWithChildren } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-brand-background-dashboard text-brand-text">
      <div className="max-w-dashmw mx-auto h-screen w-full overflow-hidden">
        <UserHeader />
        <div className="px-xLayout py-xLayout h-[calc(100vh-70px)] w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
