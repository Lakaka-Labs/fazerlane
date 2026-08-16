import { FAZER_STREAKS, FAZER_VIEWBOX } from "@/components/brand/fazer-mark";
import { cn } from "@/lib/utils";

/**
 * The Fazerlane mark is four diagonal streaks descending across the tile. As a
 * loader they cascade top to bottom, each one sweeping along its own diagonal
 * and fading at both ends, so the loop reads as movement down a lane. A faint
 * static copy sits underneath so the logo stays legible between sweeps.
 */

export interface LogoLoaderProps {
  /** Rendered size of the mark in pixels. */
  size?: number;
  /** Caption shown under the mark. Always announced to screen readers. */
  label?: string;
  /** Hide the caption visually but keep it for assistive tech. */
  hideLabel?: boolean;
  className?: string;
}

export default function LogoLoader({
  size = 48,
  label = "Loading",
  hideLabel = true,
  className,
}: LogoLoaderProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "text-brand-text inline-flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={FAZER_VIEWBOX}
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Static ghost of the full mark */}
        <g fill="currentColor" opacity={0.1}>
          {FAZER_STREAKS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g fill="currentColor">
          {FAZER_STREAKS.map((d, index) => (
            <path
              key={d}
              d={d}
              className="animate-fazer-streak"
              style={{ animationDelay: `${index * 0.13}s` }}
            />
          ))}
        </g>
      </svg>

      <span
        className={cn(
          "text-brand-text/45 text-[11px] font-bold tracking-[0.14em] uppercase",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </span>
    </span>
  );
}
