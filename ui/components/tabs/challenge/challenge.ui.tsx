"use client";

/**
 * Shared visual language for the challenge workspace.
 *
 * The dashboard canvas is white, so every surface here reads as a panel the
 * same way the lane sidebar does: white fill, hairline `brand-divider` border
 * and `brand-shadow`. Nested/inset surfaces drop to `brand-background-dashboard`
 * so depth is created by tone rather than by more borders.
 *
 * The app's shape signature — a small radius everywhere with one oversized
 * top-left corner, taken from `<Button />` — is echoed on chips and icon tiles.
 */

import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  CodeXml,
  FileMinus,
  Image as ImageIcon,
  TextInitial,
  Video,
  Volume2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------- surfaces - */

export const SectionCard = ({
  className,
  children,
  ...props
}: ComponentProps<"section">) => (
  <section
    className={cn(
      "border-brand-divider shadow-brand-shadow rounded-2xl border border-solid bg-white",
      className
    )}
    {...props}
  >
    {children}
  </section>
);

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconSlot?: ReactNode;
  title: string;
  description?: string;
  trailing?: ReactNode;
  bordered?: boolean;
  className?: string;
}

export const SectionHeader = ({
  icon: Icon,
  iconSlot,
  title,
  description,
  trailing,
  bordered = false,
  className,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6",
      bordered && "border-brand-divider border-b border-solid pb-4 md:pb-5",
      className
    )}
  >
    <div className="flex min-w-0 items-start gap-3">
      {(iconSlot || Icon) && (
        <span className="bg-brand-text/[0.06] text-brand-text/70 flex size-9 shrink-0 items-center justify-center rounded-lg">
          {iconSlot ?? (Icon ? <Icon className="size-[18px]" strokeWidth={1.8} /> : null)}
        </span>
      )}

      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="text-brand-text text-base font-bold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-brand-text/50 text-xs leading-relaxed font-normal">
            {description}
          </p>
        )}
      </div>
    </div>

    {trailing && (
      <div className="flex shrink-0 items-center gap-2">{trailing}</div>
    )}
  </div>
);

export const SectionBody = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn("px-5 pt-4 pb-5 md:px-6 md:pb-6", className)}
    {...props}
  >
    {children}
  </div>
);

/** Recessed panel used inside a card — feedback blocks, video frames, previews. */
export const InsetPanel = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn(
      "border-brand-divider bg-brand-background-dashboard rounded-xl border border-solid",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/* ----------------------------------------------------------------- chips - */

export type ChipTone = "neutral" | "ink" | "red" | "green" | "amber";

const chipTones: Record<ChipTone, string> = {
  neutral: "border-brand-text/15 bg-brand-text/[0.04] text-brand-text/70",
  ink: "border-brand-text bg-brand-text text-brand-white",
  red: "border-brand-red/25 bg-brand-red/10 text-brand-red-50",
  green: "border-brand-green/25 bg-brand-lite-green text-brand-green",
  amber: "border-amber-500/25 bg-amber-50 text-amber-700",
};

/**
 * Where a chip sits in a run. The oversized corner brackets a *group* of chips
 * — leading chip top-left, trailing chip top-right — so the run reads as one
 * object. A chip standing on its own (a status or a count) stays square: the
 * motif is reserved for things you act on and for the header's identity strip,
 * not sprinkled on every label. Set automatically by `<ChipGroup />`.
 */
export type ChipCorner = "start" | "middle" | "end" | "solo";

const chipCorners: Record<ChipCorner, string> = {
  solo: "rounded rounded-tl-lg",
  start: "rounded rounded-tl-lg",
  middle: "rounded",
  end: "rounded rounded-tr-lg",
};

interface ChipProps extends ComponentProps<"span"> {
  tone?: ChipTone;
  icon?: LucideIcon;
  corner?: ChipCorner;
}

export const Chip = ({
  tone = "neutral",
  icon: Icon,
  corner,
  className,
  children,
  ...props
}: ChipProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 border border-solid px-2.5 py-1 text-[10px] leading-none font-bold tracking-[0.08em] whitespace-nowrap uppercase",
      // Outside a group a chip is a plain label, so it stays square.
      corner ? chipCorners[corner] : "rounded",
      chipTones[tone],
      className
    )}
    {...props}
  >
    {Icon && <Icon className="size-3" strokeWidth={2.2} />}
    {children}
  </span>
);

/** Lays out chips in a row and hands each one its position in the run. */
export const ChipGroup = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const items = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<ChipProps>[];

  const lastIndex = items.length - 1;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((child, index) =>
        cloneElement(child, {
          corner:
            items.length === 1
              ? "solo"
              : index === 0
                ? "start"
                : index === lastIndex
                  ? "end"
                  : "middle",
        })
      )}
    </div>
  );
};

/* ------------------------------------------------------------ empty state - */

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "border-brand-divider bg-brand-background-dashboard/60 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
      className
    )}
  >
    <span className="border-brand-divider text-brand-text/30 flex size-12 items-center justify-center rounded-full border border-solid bg-white">
      <Icon className="size-5" strokeWidth={1.8} />
    </span>

    <div className="flex flex-col gap-1">
      <p className="text-brand-text text-sm font-semibold">{title}</p>
      {description && (
        <p className="text-brand-text/50 mx-auto max-w-sm text-xs leading-relaxed">
          {description}
        </p>
      )}
    </div>

    {action}
  </div>
);

/* --------------------------------------------------------------- markdown - */

/**
 * `@tailwindcss/typography` isn't installed, so `prose` was a no-op wherever it
 * was used. This renders markdown with explicit, on-brand typography instead.
 */
export const Markdown = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <div
    className={cn(
      "text-brand-text/75 text-[15px] leading-relaxed break-words",
      "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      "[&_p]:my-3",
      "[&_h1]:text-brand-text [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold",
      "[&_h2]:text-brand-text [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold",
      "[&_h3]:text-brand-text [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold",
      "[&_h4]:text-brand-text [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold",
      "[&_strong]:text-brand-text [&_strong]:font-semibold",
      "[&_a]:text-brand-red [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80",
      "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
      "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
      "[&_li]:pl-1 [&_li::marker]:text-brand-text/35",
      "[&_blockquote]:border-brand-red/40 [&_blockquote]:text-brand-text/60 [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-solid [&_blockquote]:pl-4 [&_blockquote]:italic",
      "[&_code]:bg-brand-text/[0.06] [&_code]:text-brand-text [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
      "[&_pre]:bg-brand-deep-black [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_pre]:text-white",
      "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
      "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
      "[&_th]:border-brand-divider [&_th]:bg-brand-background-dashboard [&_th]:text-brand-text [&_th]:border [&_th]:border-solid [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
      "[&_td]:border-brand-divider [&_td]:border [&_td]:border-solid [&_td]:px-3 [&_td]:py-2",
      "[&_hr]:border-brand-divider [&_hr]:my-6",
      "[&_img]:my-3 [&_img]:rounded-xl",
      className
    )}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

/* ------------------------------------------------------- domain helpers - */

export const submissionFormatMeta: Record<
  string,
  { icon: LucideIcon; label: string }
> = {
  video: { icon: Video, label: "Video" },
  image: { icon: ImageIcon, label: "Image" },
  text: { icon: TextInitial, label: "Text" },
  document: { icon: FileMinus, label: "Document" },
  audio: { icon: Volume2, label: "Audio" },
  code: { icon: CodeXml, label: "Code" },
};

export function getSubmissionFormatMeta(format: string) {
  return (
    submissionFormatMeta[format?.toLowerCase()] ?? {
      icon: FileMinus,
      label: format,
    }
  );
}

/** Difficulty is free-form text from the model, so match loosely. */
export function difficultyTone(difficulty?: string): ChipTone {
  const value = difficulty?.toLowerCase() ?? "";

  if (/beginner|easy|basic|starter|novice/.test(value)) return "green";
  if (/advanced|hard|expert|difficult|pro/.test(value)) return "red";

  return "amber";
}

/** Accepts `s`, `m:ss` or `h:mm:ss` and always returns whole seconds. */
export function timecodeToSeconds(value?: string): number {
  if (!value) return 0;

  const parts = value.split(":").map((part) => Number.parseInt(part, 10));
  if (parts.some(Number.isNaN)) return 0;

  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Renders a timestamp as `m:ss`, adding hours only when the clip needs them. */
export function formatTimecode(value?: string): string {
  const total = timecodeToSeconds(value);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`
    : `${minutes}:${paddedSeconds}`;
}
