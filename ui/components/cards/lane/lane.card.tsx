"use client";

import { CircularProgress } from "@/components/progress-09";
import appRoutes from "@/config/routes";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LearnCard() {
  const [progress, setProgress] = useState(13);

  return (
    <Link
      href={appRoutes.dashboard.user.lane("randomLane1")}
      className="border-brand-border flex cursor-pointer flex-col gap-3 rounded-md border border-solid"
    >
      <Image
        src={"/temp/image 2.png"}
        alt="img"
        width={100}
        height={100}
        className="h-[210px] w-full rounded-t-md object-cover object-center"
      />

      <div className="flex w-full justify-between">
        <div className="flex w-full items-start justify-between gap-3 px-4">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Video Title</p>

            <div className="flex items-center gap-px">
              <span>12 Attempts</span>
              <Dot />
              <span>5 hours ago</span>
            </div>
          </div>

          <div className="size-[70px] overflow-hidden">
            <CircularProgress
              value={(8 / 10) * 100}
              size={70}
              strokeWidth={6}
              circleStrokeWidth={6}
              progressStrokeWidth={6}
              showLabel
              labelClassName="text-[10px] font-extrabold"
              renderLabel={(progress) => `8 / 10`}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
