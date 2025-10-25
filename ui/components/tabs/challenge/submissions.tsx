"use client";

import AskAIButton from "@/components/button/ask-ai";
import { useEffect, useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionContainer } from "./components";
import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "@/api/queries/challenge/submissions/get";
import { InlineLoader } from "@/components/loader";
import { dateToNow } from "@/utils/date-to-now";
import Image from "next/image";
import { usePersistStore } from "@/store/persist.store";

export const SubmissionsTab = () => {
  const { currentChallenge } = usePersistStore((store) => store);

  if (!currentChallenge?.id) {
    return <div>No challenge ID provided</div>;
  }

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["get-challenge-submissions"],
    queryFn: () =>
      getSubmissions({ challenge_id: currentChallenge.id as string }),
  });

  console.log("submissions", submissions);

  return (
    <div className="flex flex-col gap-6">
      <SectionContainer>
        <div className="flex flex-col gap-6">
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center py-10">
              <InlineLoader />
            </div>
          )}

          {submissions && submissions.length < 1 && (
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
                files={submission.files}
                text={submission.textSubmission}
                comments={submission.comment}
              />
            ))}
        </div>
      </SectionContainer>

      <div className="flex justify-end">
        <AskAIButton />
      </div>
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
        className="border-brand-black/20 flex h-20 items-center justify-between rounded-t-xl border-b px-4"
      >
        <p className="text-brand-grey text-base font-medium">{time}</p>

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
        {isOpen && files.length > 0 && (
          <motion.div
            key="submission-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-6 px-4 py-6"
          >
            <div
              className={`border-brand-green bg-brand-lite-green flex transform cursor-pointer flex-col gap-3 rounded-md border-l-4 border-solid p-4 transition-all duration-200 ease-linear`}
            >
              <h4 className="text-brand-green text-base font-semibold">
                Feedback
              </h4>
              <p className="text-brand-black text-base font-normal">
                {feedback}
              </p>
            </div>

            <div className="text-brand-black flex flex-col gap-2">
              <h4 className="text-base font-semibold">Submitted Files</h4>

              {files.length > 0 ? (
                <div className="bg-brand-background-dashboard flex flex-wrap gap-4 rounded-xl p-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg"
                    >
                      <FileDisplay url={file} />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  ))}{" "}
                </div>
              ) : (
                <p className="bg-brand-background-dashboard flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
                  No submitted files.
                </p>
              )}
            </div>

            <div className="text-brand-black flex flex-col gap-2">
              <h4 className="text-base font-semibold">Text Submission</h4>

              {text ? (
                <p className="bg-brand-background-dashboard rounded-xl p-4 text-base font-normal">
                  {text}
                </p>
              ) : (
                <p className="bg-brand-background-dashboard flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
                  No text submission provided.
                </p>
              )}
            </div>

            <div className="text-brand-black flex flex-col gap-2">
              <h4 className="text-base font-semibold">Comments</h4>

              {comments ? (
                <p className="bg-brand-background-dashboard rounded-xl p-4 text-base font-normal">
                  {comments}
                </p>
              ) : (
                <p className="bg-brand-background-dashboard flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
                  No comments provided.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// {files.length > 0 ? (
//   <div className="bg-brand-background-dashboard flex flex-wrap gap-4 rounded-xl p-4">
//     {files.map((file, index) => (
//       <div
//         key={index}
//         className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg"
//       >
//         {file.type === "image" ? (
//           <img
//             src={file.link}
//             alt={`File ${index + 1}`}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <>
//             <video
//               src={file.link}
//               className="h-full w-full object-cover"
//               muted
//               playsInline
//             />
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
//                 <Play
//                   className="ml-0.5 h-4 w-4 text-gray-800"
//                   fill="currentColor"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
//       </div>
//     ))}
//   </div>
// ) : (
//   <p className="bg-brand-background-dashboard flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
//     No submitted files.
//   </p>
// )}

interface FileDisplayProps {
  url: string;
  className?: string;
}

function FileDisplay({ url, className }: FileDisplayProps) {
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <InlineLoader />;
  }

  if (!fileType) {
    return <div>Unable to load file</div>;
  }

  // Image files
  if (fileType.startsWith("image/")) {
    return (
      <Image
        src={url}
        alt="Submission"
        width={800}
        height={600}
        className={`h-full w-full object-cover`}
      />
    );
  }

  // Video files
  if (fileType.startsWith("video/")) {
    return (
      <>
        <video src={url} controls className={`h-full w-full object-cover`}>
          Your browser does not support video playback.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <Play
              className="ml-0.5 h-4 w-4 text-gray-800"
              fill="currentColor"
            />
          </div>
        </div>
      </>
    );
  }

  // PDF files
  if (fileType === "application/pdf") {
    return <iframe src={url} className={className} title="PDF Viewer" />;
  }

  // Audio files
  if (fileType.startsWith("audio/")) {
    return <audio src={url} controls className={className} />;
  }

  // Fallback: Download link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      Download File ({fileType})
    </a>
  );
}
