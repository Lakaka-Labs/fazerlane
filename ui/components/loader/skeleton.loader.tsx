import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "bg-brand-black/20",
        roundedClass,
        animationClass,
        variant === "wave" &&
          "from-brand-black/10 via-brand-black/50 to-brand-black/10 bg-gradient-to-r",
        className
      )}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-busy="true"
      aria-live="polite"
    />
  );
}
