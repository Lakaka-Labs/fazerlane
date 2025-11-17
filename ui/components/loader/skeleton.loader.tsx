import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  variant?: "pulse" | "wave" | "none";
}

export default function SkeletonLoader({
  width = "100%",
  height = "100%",
  rounded = "md",
  className,
  variant = "pulse",
}: SkeletonLoaderProps) {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  const animationClass = {
    pulse: "animate-pulse",
    wave: "animate-gradient",
    none: "",
  }[variant];

  return (
    <div className="group relative flex transform cursor-pointer flex-col gap-4 rounded-md transition-all duration-200 ease-in-out md:gap-6">
      {/* Thumbnail Skeleton */}
      <div className="h-[250px] w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

      {/* Progress Card Section Skeleton */}
      <div className="flex w-full px-4 pb-2 md:pb-3">
        {/* Circular Progress Skeleton */}
        <div className="flex h-12 w-12 shrink-0 animate-pulse items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700" />

        {/* Content Skeleton */}
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex flex-col gap-2 pl-3">
            {/* Title Skeleton */}
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200 md:h-7 lg:w-64 dark:bg-gray-700" />

            {/* Metadata Skeleton */}
            <div className="flex items-center">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <Dot className={`text-gray-200`} />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Dropdown Menu Skeleton */}
        <div className={`flex flex-col gap-1`}>
          <div className="mr-2 h-1 min-h-fit w-1 min-w-fit shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mr-2 h-1 min-h-fit w-1 min-w-fit shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mr-2 h-1 min-h-fit w-1 min-w-fit shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
