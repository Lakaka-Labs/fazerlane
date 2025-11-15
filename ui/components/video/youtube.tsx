"use client";

import dynamic from "next/dynamic";
import { InlineLoader } from "../loader";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full items-center justify-center py-10">
      <InlineLoader fill />
    </div>
  ),
});

interface YoutubeVideoProps {
  url: string;
  controls?: boolean;
  startTime?: string;
  endTime?: string;
}

export default function YoutubeVideo({
  url,
  controls = true,
  startTime,
  endTime,
}: YoutubeVideoProps) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  return (
    <ReactPlayer
      src={url + `?start=${start}&end=${end}`}
      playing={true}
      controls={controls}
      config={{
        youtube: {
          color: "white",
          start: start,
          end: end,
          origin: window.location.origin,
        },
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

const parseTime = (time?: string): number => {
  if (!time) return 0;

  if (/^\d+$/.test(time)) {
    return parseInt(time);
  }

  if (time.includes(":")) {
    const parts = time.split(":");

    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      return hours * 3600 + minutes * 60 + seconds;
    }

    if (parts.length === 2) {
      const minutes = parseInt(parts[0]);
      const seconds = parseInt(parts[1]);
      return minutes * 60 + seconds;
    }
  }

  const match = time.match(/(?:(\d+)m)?(?:(\d+)s)?/);
  if (!match) return 0;

  const minutes = parseInt(match[1] || "0");
  const seconds = parseInt(match[2] || "0");

  return minutes * 60 + seconds;
};
