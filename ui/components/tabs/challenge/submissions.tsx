"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  MessageSquare,
  Paperclip,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { queryKeys } from "@/config/routes";
import { cn } from "@/lib/utils";
import { unmarkChallenge } from "@/services/mutations/challenge/unmark";
import { getSubmissions } from "@/services/queries/challenge/submissions/get";
import { usePersistStore } from "@/store/persist.store";
import { dateToNow } from "@/utils/date-to-now";

import {
  Chip,
  EmptyState,
  InsetPanel,
  Markdown,
  SectionBody,
  SectionCard,
  SectionHeader,
} from "./challenge.ui";
import FilePreview from "./fileDisplay";

export const SubmissionsTab = () => {
  const queryClient = useQueryClient();
  const { currentChallenge } = usePersistStore((store) => store);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const challengeId = currentChallenge?.id;

  const { data: submissions, isLoading } = useQuery({
    queryKey: [queryKeys.getChallengeSubmissions, challengeId],
    queryFn: () => getSubmissions({ challenge_id: challengeId as string }),
    enabled: Boolean(challengeId),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: unmarkChallenge,
    onSuccess: () => {
      toast.success("Submissions cleared successfully!");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getChallengeSubmissions],
      });
    },
    onSettled: () => setConfirmingClear(false),
  });

  async function handleClearSubmissions() {
    if (!currentChallenge) {
      toast.error("No challenge selected.");
      return;
    }

    await mutateAsync({ challenge_id: currentChallenge.id });
  }

  if (!challengeId) {
    return (
      <SectionCard>
        <SectionBody className="pt-5 md:pt-6">
          <EmptyState
            icon={History}
            title="No challenge selected"
            description="Pick a challenge from the lane sidebar to see its attempt history."
          />
        </SectionBody>
      </SectionCard>
    );
  }

  const attempts = submissions ?? [];
  const passed = attempts.filter((attempt) => attempt.pass).length;

  return (
    <SectionCard className="overflow-hidden">
      <SectionHeader
        icon={History}
        title="Attempt history"
        description="Every submission you've made for this challenge, newest first"
        bordered={!isLoading && attempts.length > 0}
        trailing={
          attempts.length > 0 ? (
            <>
              <Chip tone={passed > 0 ? "green" : "neutral"}>
                {passed} / {attempts.length} passed
              </Chip>

              {confirmingClear ? (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={handleClearSubmissions}
                  >
                    {isPending ? "Clearing…" : "Confirm"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => setConfirmingClear(false)}
                    className="text-brand-text/50 rounded-tl rounded-tr-lg"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmingClear(true)}
                  className="text-brand-text/50 hover:text-brand-red gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </>
          ) : undefined
        }
      />

      {isLoading && (
        <SectionBody className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border-brand-divider flex items-center gap-3 rounded-xl border border-solid p-4"
            >
              <span className="bg-brand-text/10 size-10 shrink-0 animate-pulse rounded-lg" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="bg-brand-text/10 h-3.5 w-40 animate-pulse rounded-full" />
                <span className="bg-brand-text/10 h-3 w-24 animate-pulse rounded-full" />
              </span>
            </div>
          ))}
        </SectionBody>
      )}

      {!isLoading && attempts.length < 1 && (
        <SectionBody>
          <EmptyState
            icon={RotateCcw}
            title="No attempts yet"
            description="Head to the Tasks tab, submit your work, and every attempt — with its feedback — will be kept here."
          />
        </SectionBody>
      )}

      {!isLoading && attempts.length > 0 && (
        <ul className="divide-brand-divider divide-y divide-solid">
          {attempts.map((attempt, index) => (
            <SubmissionRow
              key={attempt.id}
              attempt={attempts.length - index}
              time={dateToNow(attempt.createdAt)}
              passed={attempt.pass}
              feedback={attempt.feedback}
              files={attempt.filesUrl ?? []}
              text={attempt.textSubmission}
              comments={attempt.comment}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  );
};

interface SubmissionRowProps {
  attempt: number;
  time: string;
  passed: boolean;
  feedback: string;
  files: string[];
  text: string | null;
  comments: string | null;
}

const SubmissionRow = ({
  attempt,
  time,
  passed,
  feedback,
  files,
  text,
  comments,
}: SubmissionRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition-colors duration-200 md:gap-4 md:px-6",
          isOpen ? "bg-brand-text/[0.03]" : "hover:bg-brand-text/[0.02]"
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            passed
              ? "bg-brand-green/15 text-brand-green"
              : "bg-brand-red/10 text-brand-red"
          )}
        >
          {passed ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <XCircle className="size-5" />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-brand-text text-sm font-semibold md:text-base">
            <span className="text-brand-text/35 mr-2 font-mono text-xs">
              #{String(attempt).padStart(2, "0")}
            </span>
            {passed ? "Passed" : "Needs another pass"}
          </span>

          <span className="text-brand-text/45 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3" />
              {time}
            </span>

            {files.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Paperclip className="size-3" />
                {files.length}{" "}
                {files.length === 1 ? "attachment" : "attachments"}
              </span>
            )}

            {comments && (
              <span className="flex items-center gap-1.5">
                <MessageSquare className="size-3" />
                Noted
              </span>
            )}
          </span>
        </span>

        <Chip
          tone={passed ? "green" : "red"}
          className="hidden shrink-0 md:inline-flex"
        >
          {passed ? "Passed" : "Failed"}
        </Chip>

        <ChevronDown
          className={cn(
            "text-brand-text/40 group-hover:text-brand-text/70 size-5 shrink-0 transition-transform duration-200 ease-out",
            isOpen && "text-brand-text rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 px-5 pb-6 md:px-6">
              {/* Feedback leads — it's the reason anyone opens a row. */}
              <InsetPanel
                className={cn(
                  "p-4",
                  passed
                    ? "border-brand-green/20 bg-brand-lite-green/50"
                    : "border-brand-red/20 bg-brand-red/5"
                )}
              >
                <p
                  className={cn(
                    "mb-2 text-[10px] font-bold tracking-[0.1em] uppercase",
                    passed ? "text-brand-green" : "text-brand-red-50"
                  )}
                >
                  Feedback
                </p>
                <Markdown className="text-sm">{feedback}</Markdown>
              </InsetPanel>

              {files.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <FieldLabel icon={Paperclip}>Attachments</FieldLabel>
                  <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                    {files.map((file, index) => (
                      <FilePreview key={`${file}-${index}`} url={file} />
                    ))}
                  </div>
                </div>
              )}

              {text && (
                <div className="flex flex-col gap-2.5">
                  <FieldLabel icon={History}>Your submission</FieldLabel>
                  <InsetPanel className="bg-white p-4">
                    <Markdown className="text-sm">{text}</Markdown>
                  </InsetPanel>
                </div>
              )}

              {comments && (
                <div className="flex flex-col gap-2.5">
                  <FieldLabel icon={MessageSquare}>Your note</FieldLabel>
                  <InsetPanel className="bg-white p-4">
                    <Markdown className="text-sm">{comments}</Markdown>
                  </InsetPanel>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const FieldLabel = ({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <p className="text-brand-text/45 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase">
    <Icon className="size-3" />
    {children}
  </p>
);
