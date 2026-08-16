import { cn } from "@/lib/utils";
import LogoLoader from "./logo.loader";

interface InlineLoaderProps {
  /** Stretch to the parent's box and centre inside it. */
  fill?: boolean;
  size?: number;
  label?: string;
  className?: string;
}

export default function InlineLoader({
  fill = true,
  size = 42,
  label,
  className,
}: InlineLoaderProps) {
  return (
    <span
      className={cn(
        // `flex` has to survive class merging — pairing it with a `block` /
        // `inline` toggle silently wins the display slot and kills centring.
        "flex items-center justify-center",
        fill ? "h-full w-full" : "w-fit",
        className
      )}
    >
      <LogoLoader size={size} label={label ?? "Loading"} />
    </span>
  );
}
