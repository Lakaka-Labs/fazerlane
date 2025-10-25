"use client";

import { FileData } from "@/types/api/challenges/tasks";
import { X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  fileLink: FileData[];
  setFileLink: React.Dispatch<React.SetStateAction<FileData[]>>;
}

export default function FileUpload({ fileLink, setFileLink }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    addFiles(selectedFiles);
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

  const removeFile = (id: string): void => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        className={`bg-brand-background-dashboard relative flex h-[200px] items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging ? "border-blue-500" : "border-brand-black/60"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-brand-grey">
          <p className="mb-2 text-base font-normal">
            Drop your video, image or audio here or{" "}
            <button
              onClick={handleBrowseClick}
              className="text-brand-black font-medium underline underline-offset-3"
            >
              browse
            </button>
          </p>
          <p className="text-sm">Max file size: 500mb</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">All Files</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{file.size}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="ml-4 rounded p-1 transition-colors hover:bg-gray-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
