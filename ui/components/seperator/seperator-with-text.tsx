import { cn } from "@/lib/utils";

interface TextSeperatorProps {
  text: string;
  className?: string;
}

export default function TextSeperator({ text, className }: TextSeperatorProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="bg-border h-px w-full" />
      <span className={cn(`text-border text-base font-normal`, className)}>
        {text}
      </span>
      <span className="bg-border h-px w-full" />
    </div>
  );
}
