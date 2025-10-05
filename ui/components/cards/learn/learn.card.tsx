"use client";

import { CircularProgress } from "@/components/progress-09";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export default function LearnCard() {
  const [progress, setProgress] = useState(13);

  return (
    <div className="pb-xLayout flex cursor-pointer flex-col gap-4 rounded-md shadow-md">
      <div className="flex items-center justify-center rounded-t-md bg-gray-300 py-2">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center">
          <CircularProgress
            value={progress}
            size={120}
            strokeWidth={10}
            showLabel
            labelClassName="text-xl font-bold"
            renderLabel={(progress) => `${progress}%`}
          />
        </div>
      </div>

      <div className="px-xLayout relative flex justify-between">
        <div>
          <p className="text-lg font-bold">Video Title</p>
          <div className="flex items-center gap-2">
            <span>12 Attempts</span>
            <span>*</span>
            <span>5 hours ago</span>
          </div>
        </div>

        <EllipsisVertical className="absolute right-2" />
      </div>
    </div>
  );
}
