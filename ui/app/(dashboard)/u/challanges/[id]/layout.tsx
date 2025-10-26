"use client";

import { getChallenges } from "@/api/queries/challenge/get.challenge";
import { Chatbot } from "@/components/chatbot";
import { PageLoader } from "@/components/loader";
import { LaneSideBar } from "@/components/navigation/sidebar/lane";
import { usePersistStore } from "@/store/persist.store";
import { Challenge } from "@/types/api/challenges";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, use, useEffect } from "react";

interface ChallengeLayoutProps {
  params: Promise<{
    id: string;
  }>;

  children: ReactNode;
}

export default function LaneLayout({ params, children }: ChallengeLayoutProps) {
  const { id } = use(params);

  const { setCurrentChellenge, showChatbot } = usePersistStore(
    (store) => store
  );

  function handleChallengeClick(challenge: Challenge) {
    setCurrentChellenge(challenge);
  }

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["get-challenges"],
    queryFn: () => getChallenges({ lane_id: id }),
  });

  useEffect(() => {
    if (challenge && challenge.length > 0) {
      handleChallengeClick(challenge[0]);
    }
  }, [challenge]);

  if (!id) {
    return <div>No ID provided</div>;
  }

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

      {showChatbot && <Chatbot />}
    </div>
  );
}
