import { cn } from "@/lib/utils";

/**
 * The Fazerlane mark is four diagonal streaks descending across the tile. As a
 * loader they cascade top to bottom, each one sweeping along its own diagonal
 * and fading at both ends, so the loop reads as movement down a lane. A faint
 * static copy sits underneath so the logo stays legible between sweeps.
 */
const STREAKS = [
  "M225 42L205.36 85.0199L134.652 96.5438L146.36 70.8989C150.448 61.9441 157.865 56.0182 167.505 54.0054L225 42Z",
  "M144.834 89.2705L126.822 128.724L57.7534 136.657L67.4786 115.355C71.7602 105.977 79.7502 99.8779 89.929 98.2189L144.834 89.2705Z",
  "M166.046 171.134L185.709 128.064L133.463 134.065C122.724 135.299 114.098 141.566 109.611 151.396L98.6217 175.466L166.046 171.134Z",
  "M108.803 168.193L90.7768 207.678L25 208.4L33.9301 188.84C38.637 178.53 47.9676 172.102 59.2817 171.375L108.803 168.193Z",
];

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
      {/* The artwork sits inside x 25–225 / y 42–208 of the 250pt favicon tile,
          so a square viewBox cropped to those bounds lets the mark fill the
          rendered box instead of floating in the tile's padding. */}
      <svg
        width={size}
        height={size}
        viewBox="25 25 200 200"
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Static ghost of the full mark */}
        <g fill="currentColor" opacity={0.1}>
          {STREAKS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g fill="currentColor">
          {STREAKS.map((d, index) => (
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
