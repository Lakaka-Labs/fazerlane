"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import axios, {CancelTokenSource} from "axios";
import toast from "react-hot-toast";
import {AnimatePresence, motion} from "motion/react";
import {
    Brain,
    CheckCircle2,
    Loader2,
    MessageSquare,
    PenLine,
    Sparkles,
    Target,
    TriangleAlert,
    UploadCloud,
    XCircle,
} from "lucide-react";

import FileUpload from "@/components/input/file";
import {LogoLoader} from "@/components/loader";
import {Button} from "@/components/ui/button";
import {RichTextEditor} from "@/components/ui/rich-text-editor";
import {Textarea} from "@/components/ui/textarea";
import {useQueryClient} from "@tanstack/react-query";

import {API_BASE_URL, queryKeys} from "@/config/routes";
import {cn} from "@/lib/utils";
import {SubmitTaskData} from "@/services/mutations/tasks/submit.task";
import {persistStore, usePersistStore} from "@/store/persist.store";
import {Challenge} from "@/types/api/challenges";

import {
    Chip,
    ChipGroup,
    EmptyState,
    getSubmissionFormatMeta,
    InsetPanel,
    Markdown,
    SectionBody,
    SectionCard,
    SectionHeader,
} from "./challenge.ui";

interface TasksFormValues {
    text: string;
    comments: string;
    useMemory: boolean;
}

interface SSEStarted {
    type: "started";
    challengeId: string;
}

interface SSEChunk {
    type: "chunk";
    data: string;
    challengeId: string;
}

interface SSEError {
    type: "error";
    error: string;
    code?: string;
}

interface SSEComplete {
    type: "complete";
    pass: boolean;
    feedback: string;
    challengeId: string;
}

type SSEMessage = SSEStarted | SSEChunk | SSEComplete | SSEError;

/** Formats that can only be satisfied by an upload. */
const FILE_FORMATS = ["code", "image", "video", "audio"];

export const TasksTab = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [finalResult, setFinalResult] = useState<SSEComplete | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    const queryClient = useQueryClient();

    const token = usePersistStore((state) => state.session.jwt);
    const setShowRateLimitPrompt = usePersistStore(
        (state) => state.setShowRateLimitPrompt
    );

    /**
     * A graded attempt changes the lane's progress, the sidebar tick and the
     * attempt history — none of which are part of this component's state, so
     * they have to be pushed back into the store and the query cache by hand.
     */
    function syncChallengeResult(challengeId: string, passed: boolean) {
        queryClient.invalidateQueries({
            queryKey: [queryKeys.getChallengeSubmissions],
        });

        if (!passed) return;

        const active = persistStore.getState().currentChallenge;

        if (active?.id === challengeId) {
            persistStore
                .getState()
                .setCurrentChellenge({...active, isCompleted: true});
        }

        // Patch the cached list first so the header and sidebar update instantly,
        // then refetch to pick up anything the server changed alongside it.
        queryClient.setQueryData<Challenge[]>(["get-challenges"], (challenges) =>
            challenges?.map((challenge) =>
                challenge.id === challengeId
                    ? {...challenge, isCompleted: true}
                    : challenge
            )
        );

        queryClient.invalidateQueries({queryKey: ["get-challenges"]});
    }

    const submitWithSSE = async (
        apiBaseUrl: string,
        challengeId: string,
        data: SubmitTaskData
    ) => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("New request initiated");
        }

        setIsComplete(false);
        setFinalResult(null);
        setError(null);
        setIsSubmitting(true);

        const url = `${apiBaseUrl}/challenge/${challengeId}`;
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
                responseType: "stream",
                cancelToken: cancelTokenRef.current.token,
                adapter: "fetch",
                onDownloadProgress: () => {
                    setIsConnected(true);
                    setIsSubmitting(false);
                },
            });

            setIsConnected(true);
            setIsSubmitting(false);

            const reader = response.data.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const {done, value} = await reader.read();

                if (done) {
                    setIsConnected(false);
                    break;
                }

                buffer += decoder.decode(value, {stream: true});

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);

                        try {
                            const message: SSEMessage = JSON.parse(data);

                            switch (message.type) {
                                case "started":
                                    toast.success("Task submitted successfully!");
                                    break;

                                case "chunk":
                                    break;

                                case "complete":
                                    setIsComplete(true);
                                    setFinalResult(message);
                                    setIsConnected(false);
                                    syncChallengeResult(challengeId, message.pass);
                                    break;

                                case "error":
                                    if (message.code === "AI_RATE_LIMIT") {
                                        setShowRateLimitPrompt(true);
                                    } else {
                                        setError(message.error);
                                        toast.error(message.error);
                                    }
                            }
                        } catch (err) {
                            console.error("Error parsing SSE message:", err);
                        }
                    }
                }
            }
        } catch (err: any) {
            if (axios.isCancel(err)) {
                toast.error("Request canceled");
            } else {
                const message =
                    err.response?.data?.message || err.message || "Failed to connect";

                console.error("Error with SSE request:", err);
                setError(message);
                toast.error(message);
            }
            setIsConnected(false);
            setIsSubmitting(false);
        }
    };

    const cancel = () => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Request canceled by user");
            cancelTokenRef.current = null;
        }
        setIsConnected(false);
        setIsSubmitting(false);
    };

    useEffect(() => {
        return () => {
            cancel();
        };
    }, []);

    const {currentChallenge} = usePersistStore((store) => store);

    const [formValues, setFormValues] = useState<TasksFormValues>({
        text: "",
        comments: "",
        useMemory: false,
    });

    const [files, setFiles] = useState<string[]>([]);

    function handleRichTextChange(html: string) {
        setFormValues((prev) => ({...prev, text: html}));
    }

    const formats = useMemo(
        () => currentChallenge?.submissionFormat ?? [],
        [currentChallenge]
    );

    const needsText = formats.includes("text");
    const needsFiles = FILE_FORMATS.some((format) => formats.includes(format));

    // Turn the disabled state into guidance instead of a dead button.
    const missing = useMemo(() => {
        const gaps: string[] = [];

        if (needsText && !formValues.text.trim()) gaps.push("a written response");
        if (needsFiles && files.length < 1) gaps.push("at least one file");

        return gaps;
    }, [needsText, needsFiles, formValues.text, files.length]);

    const isDisabled = missing.length > 0;
    const isBusy = isConnected || isSubmitting;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!currentChallenge) {
            toast.error("No challenge selected.");
            return;
        }

        if (missing.length > 0) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const submissionData = {
            ...formValues,
            files: files,
            challenge_id: currentChallenge.id,
        };

        submitWithSSE(API_BASE_URL, currentChallenge.id, submissionData);
    }

    const errorRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.scrollIntoView({behavior: "smooth", block: "nearest"});
        }
    }, [error]);

    useEffect(() => {
        if (isConnected && !isComplete && loadingRef.current) {
            loadingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [isConnected, isComplete]);

    useEffect(() => {
        if (isComplete && finalResult && resultRef.current) {
            resultRef.current.scrollIntoView({behavior: "smooth", block: "nearest"});
        }
    }, [isComplete, finalResult]);

    if (!currentChallenge) {
        return (
            <SectionCard>
                <SectionBody className="pt-5 md:pt-6">
                    <EmptyState
                        icon={Sparkles}
                        title="No challenge selected"
                        description="Pick a challenge from the lane sidebar to start working on it."
                    />
                </SectionBody>
            </SectionCard>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* ------------------------------------------------------ the brief - */}
            <SectionCard>
                <SectionHeader
                    icon={Target}
                    title="Your task"
                    description="What you need to produce for this challenge"
                    trailing={
                        formats.length > 0 ? (
                            <ChipGroup className="hidden justify-end sm:flex">
                                {formats.map((format) => {
                                    const meta = getSubmissionFormatMeta(format);

                                    return (
                                        <Chip key={format} icon={meta.icon}>
                                            {meta.label}
                                        </Chip>
                                    );
                                })}
                            </ChipGroup>
                        ) : undefined
                    }
                />
                <SectionBody>
                    <Markdown className="text-base">
                        {currentChallenge.assignment}
                    </Markdown>
                </SectionBody>
            </SectionCard>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* ------------------------------------------------------- upload - */}
                {needsFiles && (
                    <SectionCard>
                        <SectionHeader
                            icon={UploadCloud}
                            title="Upload"
                            description="Attach the file that proves your work"
                            trailing={
                                files.length > 0 ? (
                                    <Chip tone="green" icon={CheckCircle2}>
                                        {files.length} attached
                                    </Chip>
                                ) : (
                                    <Chip tone="amber">Required</Chip>
                                )
                            }
                        />
                        <SectionBody>
                            <FileUpload fileLink={files} setFileLink={setFiles}/>
                        </SectionBody>
                    </SectionCard>
                )}

                {/* --------------------------------------------- written response - */}
                {needsText && (
                    <SectionCard>
                        <SectionHeader
                            icon={PenLine}
                            title="Written response"
                            description="Markdown, code blocks and links are all supported"
                            trailing={
                                formValues.text.trim() ? (
                                    <Chip tone="green" icon={CheckCircle2}>
                                        Drafted
                                    </Chip>
                                ) : (
                                    <Chip tone="amber">Required</Chip>
                                )
                            }
                        />
                        <SectionBody>
                            <RichTextEditor
                                value={formValues.text}
                                onChange={handleRichTextChange}
                                placeholder="Write your answer here — explain your thinking, paste code, link your work…"
                                className="border-brand-divider rounded-xl"
                            />
                        </SectionBody>
                    </SectionCard>
                )}

                {/* -------------------------------------------- notes for the AI - */}
                <SectionCard>
                    <SectionHeader
                        icon={MessageSquare}
                        title="Notes for the reviewer"
                        description="Optional context that helps the model judge your attempt fairly"
                    />
                    <SectionBody>
                        <Textarea
                            value={formValues.comments}
                            onChange={(event) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    comments: event.target.value,
                                }))
                            }
                            placeholder="e.g. I filmed this left-handed because of an injury…"
                            rows={3}
                            className="border-brand-divider focus-visible:border-brand-text/30 resize-none rounded-xl"
                        />
                    </SectionBody>
                </SectionCard>

                {/* ------------------------------------------------------- memory - */}
                <SectionCard>
                    <SectionHeader
                        icon={Brain}
                        title="Memory"
                        description="Let the model weigh your earlier attempts when it grades this one"
                    />
                    <SectionBody>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-brand-text/60 max-w-2xl text-sm leading-relaxed">
                                With memory on, feedback builds on your history in this lane instead of judging every
                                submission from scratch.
                            </p>

                            <SegmentedToggle
                                value={formValues.useMemory}
                                onChange={(useMemory) =>
                                    setFormValues((prev) => ({...prev, useMemory}))
                                }
                            />
                        </div>
                    </SectionBody>
                </SectionCard>

                {/* ------------------------------------------------------- submit - */}
                <div
                    className="border-brand-divider shadow-brand-shadow flex flex-col gap-3 rounded-2xl border border-solid bg-white p-5 md:p-6">
                    <div className="flex items-center gap-3">
                        <Button
                            size="lg"
                            disabled={isDisabled || isBusy}
                            className="flex-1"
                            type="submit"
                        >
                            {isSubmitting && <Loader2 className="size-4 animate-spin"/>}
                            {isSubmitting
                                ? "Submitting…"
                                : isConnected
                                    ? "Evaluating…"
                                    : "Submit for review"}
                        </Button>

                        {isBusy && (
                            <Button
                                size="lg"
                                type="button"
                                variant="outline"
                                onClick={cancel}
                                className="border-brand-red/30 text-brand-red hover:bg-brand-red/5 hover:text-brand-red-50 rounded-tl rounded-tr-2xl px-6"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>

                    <p className="text-brand-text/45 text-xs">
                        {isDisabled
                            ? `Add ${missing.join(" and ")} to submit.`
                            : "Your submission is graded against the task brief above."}
                    </p>
                </div>
            </form>

            {/* --------------------------------------------------- evaluation - */}
            {/* Default (sync) mode: the incoming panel mounts immediately rather
          than waiting for the previous state to finish animating out. */}
            <AnimatePresence>
                {error && !isBusy && (
                    <motion.div
                        key="error"
                        ref={errorRef}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0}}
                        className="border-brand-red/25 bg-brand-red/5 flex items-start gap-3 rounded-2xl border border-solid p-5"
                    >
                        <TriangleAlert className="text-brand-red mt-0.5 size-5 shrink-0"/>
                        <div className="flex flex-col gap-1">
                            <p className="text-brand-text text-sm font-semibold">
                                We couldn&apos;t finish the review
                            </p>
                            <p className="text-brand-text/60 text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}

                {isConnected && !isComplete && (
                    <motion.div
                        key="evaluating"
                        ref={loadingRef}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0}}
                    >
                        <SectionCard className="overflow-hidden">
                            <SectionBody className="flex items-start gap-4 pt-5 md:pt-6">
                <span
                    className="bg-brand-text/[0.06] text-brand-text flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <LogoLoader size={22}/>
                </span>

                                <div className="flex flex-1 flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-brand-text text-sm font-semibold">
                                            Evaluating your submission
                                        </p>
                                        <p className="text-brand-text/50 text-xs leading-relaxed">
                                            Reading your work against the task brief. This usually
                                            takes a few seconds — you can keep browsing other tabs.
                                        </p>
                                    </div>

                                    <div
                                        className="bg-brand-text/10 relative h-1.5 w-full overflow-hidden rounded-full">
                                        <motion.span
                                            className="via-brand-red/60 absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent to-transparent"
                                            animate={{x: ["-110%", "310%"]}}
                                            transition={{
                                                duration: 1.6,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </div>
                                </div>
                            </SectionBody>
                        </SectionCard>
                    </motion.div>
                )}

                {isComplete && finalResult && (
                    <motion.div
                        key="result"
                        ref={resultRef}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0}}
                        className={cn(
                            "shadow-brand-shadow overflow-hidden rounded-2xl border border-solid",
                            finalResult.pass
                                ? "border-brand-green/25 bg-brand-lite-green/40"
                                : "border-brand-red/25 bg-brand-red/5"
                        )}
                    >
                        <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                            <div className="flex items-start gap-3">
                <span
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        finalResult.pass
                            ? "bg-brand-green/15 text-brand-green"
                            : "bg-brand-red/10 text-brand-red"
                    )}
                >
                  {finalResult.pass ? (
                      <CheckCircle2 className="size-5"/>
                  ) : (
                      <XCircle className="size-5"/>
                  )}
                </span>

                                <div className="flex flex-col gap-1">
                                    <p className="text-brand-text text-base font-bold">
                                        {finalResult.pass ? "Challenge passed" : "Not quite yet"}
                                    </p>
                                    <p className="text-brand-text/60 text-sm leading-relaxed">
                                        {finalResult.pass
                                            ? "Every required check was satisfied — move on to the next challenge."
                                            : "Some checks didn't pass. Read the feedback, then submit again."}
                                    </p>
                                </div>
                            </div>

                            <Chip tone={finalResult.pass ? "green" : "red"}>
                                {finalResult.pass ? "Passed" : "Failed"}
                            </Chip>
                        </div>

                        {finalResult.feedback && (
                            <div className="px-5 pb-5 md:px-6 md:pb-6">
                                <InsetPanel className="border-transparent bg-white/70 p-4">
                                    <p className="text-brand-text/45 mb-2 text-[10px] font-bold tracking-[0.1em] uppercase">
                                        Feedback
                                    </p>
                                    <Markdown className="text-sm">
                                        {finalResult.feedback}
                                    </Markdown>
                                </InsetPanel>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface SegmentedToggleProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

/**
 * Two-state segmented control. The thumb slides between the halves and its
 * oversized corner swaps sides as it travels, so the shape always leans away
 * from the control's centre the way the paired nav buttons do.
 */
const SegmentedToggle = ({value, onChange}: SegmentedToggleProps) => {
    const options = [
        {label: "On", selected: true},
        {label: "Off", selected: false},
    ];

    return (
        <div
            className="border-brand-divider relative grid w-full shrink-0 grid-cols-2 rounded rounded-t-2xl border border-solid p-1 lg:w-52">
      <span
          aria-hidden
          className={cn(
              "bg-brand-text pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-b-[4px]",
              "transition-[translate,border-radius] duration-300 ease-out",
              // The oversized corner leads the thumb, leaning away from centre.
              value
                  ? "translate-x-0 rounded-tl-[14px] rounded-tr-[4px]"
                  : "translate-x-full rounded-tl-[4px] rounded-tr-[14px]"
          )}
      />

            {options.map((option) => {
                const isActive = value === option.selected;

                return (
                    <button
                        key={option.label}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(option.selected)}
                        className={cn(
                            "relative z-10 cursor-pointer px-6 py-1.5 text-sm font-semibold transition-colors duration-200",
                            isActive
                                ? "text-brand-white"
                                : "text-brand-text/45 hover:text-brand-text/70"
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
