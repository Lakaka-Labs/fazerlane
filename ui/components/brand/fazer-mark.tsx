import { cn } from "@/lib/utils";

/**
 * The Fazerlane mark — four diagonal streaks descending across the tile.
 *
 * The paths live here rather than inside either consumer so the static mark in
 * the header and the animated `<LogoLoader />` draw from one source and can't
 * drift apart.
 *
 * The artwork sits inside x 25–225 / y 42–208 of the 250pt favicon tile, so a
 * square viewBox cropped to those bounds lets the mark fill the box it is given
 * instead of floating in the tile's padding.
 */
export const FAZER_STREAKS = [
  "M225 42L205.36 85.0199L134.652 96.5438L146.36 70.8989C150.448 61.9441 157.865 56.0182 167.505 54.0054L225 42Z",
  "M144.834 89.2705L126.822 128.724L57.7534 136.657L67.4786 115.355C71.7602 105.977 79.7502 99.8779 89.929 98.2189L144.834 89.2705Z",
  "M166.046 171.134L185.709 128.064L133.463 134.065C122.724 135.299 114.098 141.566 109.611 151.396L98.6217 175.466L166.046 171.134Z",
  "M108.803 168.193L90.7768 207.678L25 208.4L33.9301 188.84C38.637 178.53 47.9676 172.102 59.2817 171.375L108.803 168.193Z",
];

export const FAZER_VIEWBOX = "25 25 200 200";

export interface FazerMarkProps {
  /** Rendered size of the mark in pixels. */
  size?: number;
  className?: string;
}

/** Static Fazerlane mark. Inherits `currentColor`, so tone is the caller's call. */
export default function FazerMark({ size = 30, className }: FazerMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={FAZER_VIEWBOX}
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <g fill="currentColor">
        {FAZER_STREAKS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
