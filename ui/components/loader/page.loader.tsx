import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface PageLoaderProps {
  className?: string;
}

export default function PageLoader({ className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "text-primary flex h-full w-full animate-pulse items-center justify-center",
        className
      )}
    >
      <LoaderCircle size={48} className="animate-spin" />
    </div>
  );
}
