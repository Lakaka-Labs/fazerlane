import { CircularProgress } from "@/components/progress-09";
import appRoutes from "@/config/routes";
import { Lane } from "@/types/api/lane";
import { dateToNow } from "@/utils/date-to-now";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LearnCardProps {
  lane: Lane;
}

export default function LearnCard({ lane }: LearnCardProps) {
  return (
    <Link
      href={appRoutes.dashboard.user.challanges(lane.id)}
      className="border-brand-border shadow-brand-shadow flex cursor-pointer flex-col gap-3 rounded-md border border-solid"
    >
      <Image
        src={lane.youtubeDetails.thumbnail}
        alt="img"
        width={1280}
        height={720}
        className="h-[210px] w-full rounded-t-md object-cover object-center"
        quality={100}
        priority
      />

      <div className="flex w-full justify-between pb-3">
        <div className="flex w-full items-center justify-between gap-3 pl-4">
          <div className="flex flex-col gap-1">
            <p className="line-clamp-1 text-xl font-black">
              {lane.youtubeDetails.title}
            </p>

            <div className="flex items-center gap-px text-sm">
              <span>{lane.totalAttempts} Attempts</span>
              <Dot />
              <span className="capitalize">{dateToNow(lane.updatedAt)}</span>
            </div>
          </div>

          <div>
            <CircularProgress
              value={
                Number(lane.totalChallenges) > 0
                  ? (Number(lane.challengesPassed) /
                      Number(lane.totalChallenges)) *
                    100
                  : 0
              }
              size={70}
              strokeWidth={6}
              circleStrokeWidth={6}
              progressStrokeWidth={6}
              showLabel
              labelClassName="text-[10px] font-extrabold"
              renderLabel={(_progress) =>
                `${
                  Number(lane.totalChallenges) > 0
                    ? `${Number(lane.challengesPassed)} /
                      ${Number(lane.totalChallenges)}`
                    : `0 / 0`
                }`
              }
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
