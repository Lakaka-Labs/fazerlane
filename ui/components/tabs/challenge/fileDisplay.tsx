"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  FileText,
  Maximize2,
  Music,
  Play,
  X,
} from "lucide-react";

import { InlineLoader } from "@/components/loader";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  url: string;
  className?: string;
}

/**
 * Attachment tile for a submission. The content type is sniffed with a HEAD
 * request, then images / video / audio open in a lightbox while everything
 * else falls back to a download affordance.
 */
export default function FilePreview({ url, className }: FilePreviewProps) {
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function detectFileType() {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        if (isMounted) setFileType(contentType);
      } catch (error) {
        console.error("Error detecting file type:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    detectFileType();

    return () => {
      isMounted = false;
    };
  }, [url]);

  useEffect(() => {
    if (!isOverlayOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOverlayOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOverlayOpen]);

  const tile = cn(
    "group border-brand-divider relative h-36 w-56 shrink-0 overflow-hidden rounded-xl border border-solid bg-white transition-[border-color,box-shadow] duration-200",
    className
  );

  if (loading) {
    return (
      <div className={cn(tile, "flex items-center justify-center")}>
        <InlineLoader size={28} />
      </div>
    );
  }

  const overlay = (content: React.ReactNode) =>
    isOverlayOpen && (
      <div
        className="animate-in fade-in bg-brand-deep-black/80 fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm duration-200"
        onClick={() => setIsOverlayOpen(false)}
      >
        <button
          type="button"
          onClick={() => setIsOverlayOpen(false)}
          aria-label="Close preview"
          className="absolute top-6 right-6 z-50 cursor-pointer rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/25"
        >
          <X className="size-5" />
        </button>

        <div onClick={(event) => event.stopPropagation()} className="relative">
          {content}
        </div>
      </div>
    );

  const expandButton = (
    <>
      <button
        type="button"
        aria-label="Open preview"
        onClick={(event) => {
          event.stopPropagation();
          setIsOverlayOpen(true);
        }}
        className="absolute inset-0 z-10 cursor-pointer bg-transparent"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-[opacity,background-color] duration-200 group-hover:bg-black/25 group-hover:opacity-100">
        <span className="rounded-full bg-white/90 p-2 text-brand-text">
          <Maximize2 className="size-4" />
        </span>
      </span>
    </>
  );

  if (!fileType) {
    return (
      <div
        className={cn(
          tile,
          "text-brand-text/40 bg-brand-background-dashboard flex flex-col items-center justify-center gap-1.5 text-center"
        )}
      >
        <FileText className="size-5" />
        <span className="text-[11px] font-medium">Preview unavailable</span>
      </div>
    );
  }

  if (fileType.startsWith("image/")) {
    return (
      <div className={cn(tile, "hover:shadow-brand-shadow")}>
        <img
          src={url}
          alt="Submission attachment"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {expandButton}
        {overlay(
          <img
            src={url}
            alt="Submission attachment"
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          />
        )}
      </div>
    );
  }

  if (fileType.startsWith("video/")) {
    return (
      <div className={cn(tile, "hover:shadow-brand-shadow bg-brand-deep-black")}>
        <video src={url} className="h-full w-full object-cover opacity-60" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-white/30 bg-black/40 p-3.5 backdrop-blur-sm">
            <Play className="size-5 text-white" />
          </span>
        </span>
        {expandButton}
        {overlay(
          <video
            src={url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
        )}
      </div>
    );
  }

  if (fileType.startsWith("audio/")) {
    return (
      <div className={cn(tile, "hover:shadow-brand-shadow")}>
        <span className="from-brand-red-50 to-brand-red absolute inset-0 bg-gradient-to-br" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-white/30 bg-white/20 p-3.5 backdrop-blur-sm">
            <Music className="size-5 text-white" />
          </span>
        </span>
        {expandButton}
        {overlay(
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl">
            <span className="bg-brand-red/10 text-brand-red rounded-full p-6">
              <Music className="size-10" />
            </span>
            <audio
              src={url}
              controls
              autoPlay
              className="w-[320px] md:w-[400px]"
            />
          </div>
        )}
      </div>
    );
  }

  if (fileType === "application/pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          tile,
          "hover:border-brand-red/40 hover:shadow-brand-shadow bg-brand-red/5 flex flex-col items-center justify-center gap-2"
        )}
      >
        <FileText className="text-brand-red size-6" />
        <span className="text-brand-red-50 text-[11px] font-bold tracking-[0.1em] uppercase">
          Open PDF
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        tile,
        "bg-brand-background-dashboard text-brand-text/60 hover:text-brand-text hover:shadow-brand-shadow flex flex-col items-center justify-center gap-2"
      )}
    >
      <ArrowDownToLine className="size-5" />
      <span className="text-[11px] font-bold tracking-[0.1em] uppercase">
        Download
      </span>
    </a>
  );
}
