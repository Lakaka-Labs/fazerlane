import { LoaderCircle } from "lucide-react";

export default function InlineLoader({ fill = false }: { fill?: boolean }) {
  return (
    <span
      className={`${fill ? "block" : "inline"} text-primary flex h-full w-full animate-pulse items-center justify-center`}
    >
      <LoaderCircle size={48} className="animate-spin" />
    </span>
  );
}
