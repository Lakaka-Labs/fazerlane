import { cn } from "@/lib/utils";
import LogoLoader from "./logo.loader";

interface PageLoaderProps {
  className?: string;
  label?: string;
  size?: number;
}

/**
 * Whole-screen loading state.
 *
 * It is deliberately `fixed inset-0` rather than filling its parent: the header
 * is fetching user info at the same time, so any loader laid out *inside* the
 * page shifts as the header resolves its height. Pinning to the viewport keeps
 * the mark dead centre on screen no matter what is still settling behind it,
 * and the opaque background covers the half-built header rather than letting it
 * pop in underneath.
 */
export default function PageLoader({
  className,
  label = "Loading",
  size = 76,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "bg-background fixed inset-0 z-50 flex items-center justify-center p-6",
        className
      )}
    >
      <LogoLoader size={size} label={label} hideLabel={false} />
    </div>
  );
}
