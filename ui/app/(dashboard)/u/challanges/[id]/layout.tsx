"use client";

import { getChallenges } from "@/api/queries/challenge/get.challenge";
import { PageLoader } from "@/components/loader";
import { LaneSideBar } from "@/components/navigation/sidebar/lane";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, use } from "react";

interface ChallengeLayoutProps {
  params: Promise<{
    id: string;
  }>;

  children: ReactNode;
}

export default function LaneLayout({ params, children }: ChallengeLayoutProps) {
  const { id } = use(params);

  if (!id) {
    return <div>No ID provided</div>;
  }

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["get-challenges"],
    queryFn: () => getChallenges({ lane_id: id }),
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!challenge || challenge.length < 1) {
    return <div>Lane not found</div>;
  }

  return (
    <div className="mx-auto flex h-full w-full gap-12 overflow-hidden">
      <LaneSideBar challenges={challenge} />

      <div className="h-full w-full overflow-y-auto pr-4">{children}</div>
    </div>
  );
}
