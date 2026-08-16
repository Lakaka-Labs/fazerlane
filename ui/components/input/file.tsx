"use client";

import { uploadFile } from "@/services/mutations/storage/upload";
import { FileData } from "@/types/api/challenges/tasks";
import { useMutation } from "@tanstack/react-query";
import {
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  fileLink: string[];
  setFileLink: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FileUpload({ fileLink, setFileLink }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutate = useMutation({
    mutationFn: (files: FormData) => uploadFile(files),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to upload files");
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 1) {
      toast.error("Please upload only one file at a time");
      return;
    }

    if (droppedFiles.length === 0) return;

    addFiles([droppedFiles[0]]);
    handleUploadFiles([droppedFiles[0]]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    if (selectedFiles.length > 1) {
      toast.error("Please upload only one file at a time");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFiles.length === 0) return;

    addFiles([selectedFiles[0]]);
    handleUploadFiles([selectedFiles[0]]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addFiles = (newFiles: File[]): void => {
    const fileData: FileData[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      file: file,
    }));
    setFiles((prev) => [...prev, ...fileData]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const removeFile = (fileData: string, randomId: string): void => {
    setFileLink((prev) => prev.filter((file) => file !== fileData));
    setFiles((prev) => prev.filter((file) => file.id !== randomId));
  };

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  async function handleUploadFiles(filesToUpload: File[]) {
    setIsLoading(true);
    const newFormData = new FormData();
    filesToUpload.forEach((file) => newFormData.append("files", file));

    const res = await mutate.mutateAsync(newFormData).finally(() => {
      setIsLoading(false);
    });

    if (res) {
      toast.success("File upload successful!");
      setFileLink((prev) => [...prev, ...res]);
    } else {
      toast.error("Failed to upload file");
      setFiles((prev) =>
          prev.filter((file) => !filesToUpload.includes(file.file))
      );
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const className = "text-brand-text/55 h-[18px] w-[18px]";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return <ImageIcon className={className} />;
    if (["mp4", "mov", "avi", "webm"].includes(ext || ""))
      return <Film className={className} />;
    if (["mp3", "wav", "ogg"].includes(ext || ""))
      return <Music className={className} />;
    if (["pdf", "doc", "docx", "txt"].includes(ext || ""))
      return <FileText className={className} />;
    return <File className={className} />;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          "group focus-visible:ring-brand-text/25 relative flex h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-[border-color,background-color] duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none",
          isDragging
            ? "border-brand-red bg-brand-red/5"
            : "border-brand-divider bg-brand-background-dashboard/60 hover:border-brand-text/25 hover:bg-brand-background-dashboard",
          isLoading && "pointer-events-none opacity-60"
        )}
        /* A div rather than a <button> because it also has to be a drop target
           and it wraps the file input; the button role plus Enter/Space keeps it
           reachable without the invalid nesting. */
        role="button"
        tabIndex={0}
        aria-label="Choose files to upload"
        aria-disabled={isLoading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center transition-transform duration-200 ease-out group-hover:scale-[1.02]">
          <span
            className={cn(
              "border-brand-divider flex size-12 items-center justify-center rounded-xl border border-solid bg-white transition-colors duration-200",
              isDragging && "border-brand-red/40"
            )}
          >
            {isLoading ? (
              <Loader2 className="text-brand-red size-5 animate-spin" />
            ) : (
              <UploadCloud
                className={cn(
                  "size-5 transition-colors duration-200",
                  isDragging
                    ? "text-brand-red"
                    : "text-brand-text/40 group-hover:text-brand-text/70"
                )}
              />
            )}
          </span>

          <div className="flex flex-col gap-1">
            <p className="text-brand-text text-sm font-semibold">
              {isLoading ? (
                "Uploading your file…"
              ) : (
                <>
                  <span className="text-brand-red">Click to upload</span> or drag
                  and drop
                </>
              )}
            </p>
            <p className="text-brand-text/45 text-xs">
              One file at a time · up to 500MB
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {fileLink.length > 0 && files.length > 0 && (
        <div className="animate-in slide-in-from-top-2 flex flex-col gap-2 duration-200">
          <p className="text-brand-text/45 text-[10px] font-bold tracking-[0.1em] uppercase">
            Uploaded ({files.length})
          </p>

          <div className="flex flex-col gap-2">
            {files.map(
              (file, index) =>
                fileLink[index] && (
                  <div
                    key={file.id}
                    className="group border-brand-divider hover:shadow-brand-shadow relative flex items-center gap-3 rounded-xl border border-solid bg-white p-3 transition-[box-shadow] duration-200"
                  >
                    <span className="bg-brand-background-dashboard flex size-9 shrink-0 items-center justify-center rounded-lg">
                      {getFileIcon(file.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-brand-text truncate text-sm font-medium">
                          {file.name}
                        </p>
                        <CheckCircle2 className="text-brand-green size-3.5 shrink-0" />
                      </div>
                      <p className="text-brand-text/45 text-xs">{file.size}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileLink[index], file.id);
                      }}
                      className="text-brand-text/35 hover:bg-brand-red/10 hover:text-brand-red focus-visible:ring-brand-text/25 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[color,background-color,scale] duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none motion-safe:active:scale-[0.97]"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
