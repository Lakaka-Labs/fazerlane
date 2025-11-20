"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ChevronDown, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionContainer } from "./components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubmissions } from "@/services/queries/challenge/submissions/get";
import { InlineLoader } from "@/components/loader";
import { dateToNow } from "@/utils/date-to-now";
import { usePersistStore } from "@/store/persist.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { unmarkChallenge } from "@/services/mutations/challenge/unmark";
import toast from "react-hot-toast";
import { queryKeys, queryStateParams } from "@/config/routes";
import { useQueryState } from "nuqs";

export const SubmissionsTab = () => {
  const queryClient = useQueryClient();
  const { currentChallenge } = usePersistStore((store) => store);
  const [tab] = useQueryState(queryStateParams.tab);

  if (!currentChallenge?.id) {
    return <div>No challenge ID provided</div>;
  }

  const {
    data: submissions,
    isLoading,
    isRefetching,
    isFetching,
    isPending: isSubmissionPending,
  } = useQuery({
    queryKey: ["get-challenge-submissions", tab],
    queryFn: () =>
      getSubmissions({ challenge_id: currentChallenge.id as string }),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: unmarkChallenge,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Submissions cleared successfully!");

        queryClient.invalidateQueries({
          queryKey: [queryKeys.getChallengeSubmissions],
        });
      }
    },
  });

  async function handleClearSubmissions() {
    if (!currentChallenge) {
      toast.error("No challenge selected.");
      return;
    }

    await mutateAsync({ challenge_id: currentChallenge.id });
  }

  if (isLoading || isRefetching || isFetching || isSubmissionPending) {
    return (
      <div className="flex flex-col gap-6">
        <SectionContainer>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-20 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionContainer>
        <div className="flex flex-col gap-6">
          {!isLoading && submissions && submissions.length < 1 && (
            <p className="bg-brand-background-dashboard text-brand-black flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
              No tasks submitted.
            </p>
          )}

          {submissions &&
            submissions.length > 0 &&
            submissions.map((submission) => (
              <SubmissionsDropdown
                key={submission.id}
                time={dateToNow(submission.createdAt)}
                status={submission.pass ? "Passed" : "Failed"}
                feedback={submission.feedback}
                files={submission.filesUrl}
                text={submission.textSubmission}
                comments={submission.comment}
              />
            ))}

          {!isLoading && submissions && submissions.length > 0 && (
            <div className="flex justify-end">
              <Button
                disabled={isPending}
                onClick={handleClearSubmissions}
                size={"lg"}
                className="bg-brand-red hover:bg-brand-red/80"
              >
                {isPending ? "Clearing..." : "Clear Submissions"}
              </Button>
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
};

interface SubmissionDropdownProps {
  time: string;
  status: "Passed" | "Failed";
  feedback: string;
  files: string[];
  text: string | null;
  comments: string | null;
}

const SubmissionsDropdown = ({
  time,
  status,
  feedback,
  files,
  text,
  comments,
}: SubmissionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleResourcesDropdown() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="border-brand-black/20 rounded-xl border">
      <div
        onClick={handleToggleResourcesDropdown}
        className={cn(
          "border-brand-black/20 flex h-20 cursor-pointer items-center justify-between rounded-t-xl px-4",
          isOpen && "border-b"
        )}
      >
        <p className="text-brand-grey text-base font-medium capitalize">
          {time}
        </p>

        <div className="flex items-center gap-4">
          <span
            className="rounded-md px-[18px] py-1.5 text-sm font-semibold"
            style={{
              background: status === "Passed" ? "#E8F5E9" : "#FF00001A",
              color: status === "Failed" ? "#FF0000" : "#2E7D32",
            }}
          >
            {status}
          </span>
          <ChevronDown size={20} color="#1D1B20" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="submission-wrapper"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.05, ease: "linear" }}
            className="flex cursor-default flex-col gap-6 overflow-hidden rounded-xl bg-white px-4 py-6"
          >
            <div
              className={`border-brand-green bg-brand-lite-green flex transform cursor-text flex-col gap-3 border-l-4 border-solid p-4 transition-all duration-200 ease-linear`}
              style={{
                background: status === "Passed" ? "#e8f5e9" : "#fd005415",
                borderColor: status === "Passed" ? "#2e7d32" : "#ff112a",
              }}
            >
              <h4
                style={{ color: status === "Passed" ? "#2e7d32" : "#ff112a" }}
                className="text-base font-semibold"
              >
                Feedback
              </h4>
              <p className="text-brand-black text-base font-normal">
                {feedback}
              </p>
            </div>

            {files.length > 0 && (
              <div className="text-brand-black flex flex-col gap-2">
                <h4 className="text-base font-semibold">Submitted Files</h4>

                <div className="bg-brand-background-dashboard flex flex-wrap gap-4 rounded-xl p-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg"
                    >
                      <FileDisplay url={file} />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {text && (
              <div className="text-brand-black flex cursor-text flex-col gap-2">
                <h4 className="text-base font-semibold">Text Submission</h4>

                <p className="bg-brand-background-dashboard rounded-xl p-4 text-base font-normal">
                  {text}
                </p>
              </div>
            )}

            {comments && (
              <div className="text-brand-black flex flex-col gap-2">
                <h4 className="text-base font-semibold">Comments</h4>

                <p className="bg-brand-background-dashboard rounded-xl p-4 text-base font-normal">
                  {comments}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FileDisplayProps {
  url: string;
  className?: string;
}

function FileDisplay({ url, className }: FileDisplayProps) {
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    async function detectFileType() {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        setFileType(contentType);
      } catch (error) {
        console.error("Error detecting file type:", error);
      } finally {
        setLoading(false);
      }
    }

    detectFileType();
  }, [url]);

  if (loading) {
    return <InlineLoader fill />;
  }

  if (!fileType) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 px-1 text-center text-sm">
        Unable to load file
      </div>
    );
  }

  // Image files
  if (fileType.startsWith("image/")) {
    return (
      <>
        <img
          src={url}
          alt="Submission"
          width={200}
          height={200}
          className={`h-full w-full object-cover`}
        />

        <button
          onClick={() => setIsOverlayOpen(true)}
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/30"
        ></button>

        {isOverlayOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsOverlayOpen(false)}
          >
            <button
              onClick={() => setIsOverlayOpen(false)}
              className="bg-brand-grey hover:bg-brand-grey/50 absolute top-4 right-4 z-10 aspect-square cursor-pointer rounded-full p-1.5 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={url}
              alt="Submission"
              width={1920}
              height={1080}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  // Video files
  if (fileType.startsWith("video/")) {
    return (
      <>
        <video src={url} controls className={`h-full w-full object-cover`}>
          Your browser does not support video playback.
        </video>

        <button
          onClick={() => setIsOverlayOpen(true)}
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/30"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <Play
              className="ml-0.5 h-4 w-4 text-gray-800"
              fill="currentColor"
            />
          </div>
        </button>

        {isOverlayOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setIsOverlayOpen(false)}
          >
            <button
              onClick={() => setIsOverlayOpen(false)}
              className="bg-brand-grey hover:bg-brand-grey/50 absolute top-4 right-4 z-10 aspect-square cursor-pointer rounded-full p-1.5 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <video
              src={url}
              controls
              autoPlay
              className="max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              Your browser does not support video playback.
            </video>
          </div>
        )}
      </>
    );
  }

  // PDF files
  if (fileType === "application/pdf") {
    return (
      <>
        <iframe src={url} className={className} title="PDF Viewer" />
        <a
          href={url}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
        ></a>
      </>
    );
  }

  // Audio files
  if (fileType.startsWith("audio/")) {
    return (
      <>
        <audio src={url} controls className={className} />
        <a
          href={url}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <Play
              className="ml-0.5 h-4 w-4 text-gray-800"
              fill="currentColor"
            />
          </div>
        </a>
      </>
    );
  }

  // Fallback: Download link
  return (
    <a
      href={url}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
        <ArrowDownToLine
          className="ml-0.5 h-4 w-4 text-gray-800"
          fill="currentColor"
        />
      </div>
    </a>
  );
}
