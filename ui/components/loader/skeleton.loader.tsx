import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  variant?: "pulse" | "wave" | "none";
}

/**
 * A single placeholder block. It is deliberately shape-agnostic: callers compose
 * the silhouette of whatever they are standing in for out of several of these.
 * The previous version ignored every prop and always drew one hardcoded lane
 * card, which is why the lane sidebar rendered five lane cards while waiting on
 * a title and a challenge list.
 */
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

  /* Tone comes from the ink colour at low opacity rather than a fixed grey, so
     placeholders sit on the dashboard surface the same way the real content
     does instead of reading as a lighter patch. */
  const variantClass = {
    pulse: "bg-brand-text/10 animate-pulse",
    wave: "animate-gradient bg-gradient-to-r from-brand-text/5 via-brand-text/15 to-brand-text/5",
    none: "bg-brand-text/10",
  }[variant];

  return (
    <span
      aria-hidden
      style={{ width: widthStyle, height: heightStyle }}
      className={cn(
        "block max-w-full shrink-0",
        roundedClass,
        variantClass,
        className
      )}
    />
  );
}
