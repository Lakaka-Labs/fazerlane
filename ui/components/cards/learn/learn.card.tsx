"use client";

import { CircularProgress } from "@/components/progress-09";
import { Dot } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LearnCard() {
  const [progress, setProgress] = useState(13);

  return (
    <div className="flex cursor-pointer flex-col gap-3 rounded-md shadow-lg">
      <Image
        src={"/temp/image 2.png"}
        alt="img"
        width={100}
        height={100}
        className="h-[210px] w-full rounded-t-md object-cover object-center"
      />

      <div className="flex justify-between">
        <div className="flex items-start gap-3">
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

          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Video Title</p>

            <div className="flex items-center gap-px">
              <span>12 Attempts</span>
              <Dot />
              <span>5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
