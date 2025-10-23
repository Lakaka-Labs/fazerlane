import { LaneSideBar } from "@/components/navigation/sidebar/lane";
import { getLane } from "@/lib/temp";
import { ReactNode } from "react";

interface LaneLayoutProps {
  params: Promise<{ id: string }>;
  children: ReactNode;
}

export default async function LaneLayout({
  params,
  children,
}: LaneLayoutProps) {
  const { id } = await params;

  const lane = await getLane(id);

  if (!id) {
    return <div>No ID provided</div>;
  }

  if (!lane) {
    return <div>Lane not found</div>;
  }

  return (
    <div className="mx-auto flex h-full w-full gap-12 overflow-hidden">
      <LaneSideBar challenges={lane} />

      <div className="h-full w-full overflow-y-auto pr-4">{children}</div>
    </div>
  );
}
