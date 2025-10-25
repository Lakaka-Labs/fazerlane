"use client";

import AskAIButton from "@/components/button/ask-ai";
import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionContainer } from "./components";

export const SubmissionsTab = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionContainer>
        <div className="flex flex-col gap-6">
          {submissions.map((submission, index) => (
            <SubmissionsDropdown
              key={index}
              time={submission.time}
              status={submission.status}
              feedback={submission.feedback}
              files={submission.files}
              text={submission.text}
              comments={submission.comments}
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
  files: { type: "video" | "image" | "audio" | "document"; link: string }[];
  text: string;
  comments: string;
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
                      {file.type === "image" ? (
                        <img
                          src={file.link}
                          alt={`File ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <video
                            src={file.link}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                              <Play
                                className="ml-0.5 h-4 w-4 text-gray-800"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  ))}
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

const submissions = [
  {
    time: "October 17, 2025 at 11:02 PM",
    status: "Passed",
    feedback:
      "Excellent work! Your foot positioning is spot on, with your front foot correctly over the front bolts and your back foot perfectly on the tail. You demonstrated good initial balance and executed the tail pop motion clearly, lifting the nose effectively. Keep practicing holding that stance and refining your tail pop for consistency. You’re ready for the next step!",
    files: [
      { type: "video", link: "https://www.youtube.com/watch?v=6pGz57bdzuw" },
      { type: "video", link: "https://www.youtube.com/watch?v=6pGz57bdzuw" },
      { type: "image", link: "/doom.jpg" },
      { type: "image", link: "/doom.jpg" },
    ],
    text: "",
    comments:
      "Thank you for the detailed feedback! I practiced this move about 30 times before recording this submission. I focused specifically on keeping my shoulders aligned during the initial rotation, which I struggled with in my previous attempts. I'm excited to move on to the next challenge and learn the one-motion technique!",
  },
  {
    time: "October 10, 2025 at 9:15 PM",
    status: "Failed",
    feedback:
      "Good effort! You’re getting close — your pop timing is solid, but your front foot needs to drag higher to level out the board mid-air. Try focusing on keeping your shoulders square to your target to help maintain balance during the motion.",
    files: [
      { type: "video", link: "https://www.youtube.com/watch?v=6pGz57bdzuw" },
      { type: "video", link: "https://www.youtube.com/watch?v=6pGz57bdzuw" },
      { type: "image", link: "/doom.jpg" },
    ],
    text: "",
    comments:
      "Appreciate the pointers. I’ll focus more on that front-foot drag and shoulder alignment in my next practice. Thanks for the detailed breakdown!",
  },
  {
    time: "October 3, 2025 at 8:42 PM",
    status: "Passed",
    feedback:
      "Nice improvement! Your consistency is much better and your balance control through the landing phase has noticeably improved. Continue practicing to make your form second nature.",
    files: [
      { type: "video", link: "https://www.youtube.com/watch?v=6pGz57bdzuw" },
      { type: "image", link: "/doom.jpg" },
      { type: "audio", link: "https://example.com/coach_notes.mp3" },
      { type: "document", link: "https://example.com/session_notes.pdf" },
    ],
    text: "",
    comments:
      "I felt a big difference this time after focusing on the timing of the pop. Thanks again for the feedback — it’s really helping me refine each attempt!",
  },
] satisfies SubmissionDropdownProps[];
