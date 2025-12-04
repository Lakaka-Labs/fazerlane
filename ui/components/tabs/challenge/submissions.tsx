"use client";

import {useEffect, useState} from "react";
import {
    ArrowDownToLine,
    ChevronDown,
    Play,
    X,
    FileText,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    AlertCircle, Music,
} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {SectionContainer} from "./components";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getSubmissions} from "@/services/queries/challenge/submissions/get";
import {InlineLoader} from "@/components/loader";
import {dateToNow} from "@/utils/date-to-now";
import {usePersistStore} from "@/store/persist.store";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {unmarkChallenge} from "@/services/mutations/challenge/unmark";
import toast from "react-hot-toast";
import {queryKeys, queryStateParams} from "@/config/routes";
import {useQueryState} from "nuqs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const SubmissionsTab = () => {
    const queryClient = useQueryClient();
    const {currentChallenge} = usePersistStore((store) => store);
    const [tab] = useQueryState(queryStateParams.tab);

    if (!currentChallenge?.id) {
        return (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed bg-muted/30 text-muted-foreground">
                No challenge ID provided
            </div>
        );
    }

    const {
        data: submissions,
        isLoading,
        isRefetching,
        isFetching,
        isPending: isSubmissionPending,
    } = useQuery({
        queryKey: ["get-challenge-submissions", tab],
        queryFn: () => getSubmissions({challenge_id: currentChallenge.id as string}),
    });

    const {mutateAsync, isPending} = useMutation({
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
        await mutateAsync({challenge_id: currentChallenge.id});
    }

    if (isLoading || isRefetching || isFetching || isSubmissionPending) {
        return (
            <div className="flex flex-col gap-6">
                <SectionContainer>
                    <div className="flex flex-col gap-4">
                        {Array.from({length: 3}).map((_, index) => (
                            <div
                                key={index}
                                className="h-24 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800"/>
                                    <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-800"/>
                                </div>
                                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800"/>
                            </div>
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
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                                <FileText className="h-6 w-6 text-gray-400"/>
                            </div>
                            <p className="text-sm font-medium">No tasks submitted yet.</p>
                        </div>
                    )}

                    {submissions && submissions.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {submissions.map((submission) => (
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
                        </div>
                    )}

                    {!isLoading && submissions && submissions.length > 0 && (
                        <div className="flex justify-end pt-2">
                            <Button
                                disabled={isPending}
                                onClick={handleClearSubmissions}
                                variant="destructive"
                                className="gap-2 shadow-sm"
                            >
                                <Trash2 className="h-4 w-4"/>
                                {isPending ? "Clearing..." : "Clear History"}
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
    const isPassed = status === "Passed";

    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border bg-white transition-all duration-200 dark:bg-gray-950",
                isOpen ? "ring-2 ring-primary/5 border-transparent" : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
            )}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center justify-between gap-4 p-4"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                            isPassed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                        )}
                    >
                        {isPassed ? (
                            <CheckCircle2 className="h-5 w-5"/>
                        ) : (
                            <XCircle className="h-5 w-5"/>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Submission {isPassed ? "Approved" : "Rejected"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3 w-3"/>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "hidden items-center rounded-full px-3 py-1 text-xs font-medium md:flex",
                            isPassed
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        )}
                    >
                        {status}
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-gray-400 transition-transform duration-200",
                            isOpen && "rotate-180 text-gray-600"
                        )}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.2, ease: "circOut"}}
                    >
                        <div className="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50 shadow-brand-shadow">
                            {/* Feedback Section - Prominent */}
                            <div
                                className={cn(
                                    "mb-6 rounded-lg border p-4",
                                    isPassed
                                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                                        : "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
                                )}
                            >
                                <h4
                                    className={cn(
                                        "mb-2 flex items-center gap-2 text-sm font-semibold",
                                        isPassed ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                                    )}
                                >
                                    <AlertCircle className="h-4 w-4"/>
                                    Feedback
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                    {feedback}
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {/* Files Section */}
                                {files.length > 0 && (
                                    <div className="flex flex-col gap-3 w-full overflow-x-auto">
                                        <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                            <FileText className="h-3.5 w-3.5"/>
                                            Attachments
                                        </h4>
                                        <div className="flex w-full overflow-x-auto gap-3">
                                            {files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                                                >
                                                    <FileDisplay url={file}/>
                                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Text & Comments Group */}
                                <div className="flex flex-col gap-6">
                                    {text && (
                                        <div className="flex flex-col gap-2">
                                            <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                                <FileText className="h-3.5 w-3.5"/>
                                                Text Submission
                                            </h4>
                                            <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}

                                    {comments && (
                                        <div className="flex flex-col gap-2">
                                            <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                                <MessageSquare className="h-3.5 w-3.5"/>
                                                Comments
                                            </h4>
                                            <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{comments}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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

function FileDisplay({url, className}: FileDisplayProps) {
    const [fileType, setFileType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function detectFileType() {
            try {
                const response = await fetch(url, {method: "HEAD"});
                const contentType = response.headers.get("content-type");
                console.log({contentType})
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

    if (loading) {
        return <div className={`aspect-square h-full`}>
            <InlineLoader fill/>
        </div>;
    }

    if (!fileType) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-center text-[10px] font-medium text-gray-400">
                Preview Unavailable
            </div>
        );
    }

    const renderOverlay = (content: React.ReactNode) => (
        isOverlayOpen && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-white/25 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOverlayOpen(false);
                }}
            >
                <button
                    onClick={() => setIsOverlayOpen(false)}
                    className="absolute right-6 top-6 z-50 rounded-full bg-black/25 p-2 text-white cursor-pointer"
                >
                    <X className="h-6 w-6"/>
                </button>
                <div onClick={(e) => e.stopPropagation()} className="relative">
                    {content}
                </div>
            </div>
        )
    );

    if (fileType.startsWith("image/")) {
        return (
            <>
                <img src={url} alt="Submission" className="h-full object-cover" loading="lazy"/>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOverlayOpen(true);
                    }}
                    className="absolute inset-0 z-10 bg-transparent cursor-pointer"
                />
                {renderOverlay(
                    <img src={url} alt="Submission Fullscreen" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"/>
                )}
            </>
        );
    }

    if (fileType.startsWith("video/")) {
        return (
            <>
                <div className="relative h-full w-fit bg-gray-900">
                    <video src={url} className="h-full object-cover opacity-60"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`transform transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-80`}>
                            <div className="rounded-full bg-black/40 p-4 backdrop-blur-sm border border-white/30">
                                <Play className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOverlayOpen(true);
                    }}
                    className="absolute inset-0 z-10 bg-transparent cursor-pointer"
                />
                {renderOverlay(
                    <video src={url} controls autoPlay className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl"/>
                )}
            </>
        );
    }

    if (fileType === "application/pdf") {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full w-full flex-col items-center justify-center bg-red-50 p-2 text-center hover:bg-red-100"
            >
                <FileText className="h-6 w-6 text-red-500"/>
                <span className="mt-1 text-[10px] font-medium text-red-600">PDF</span>
            </a>
        );
    }

    if (fileType.startsWith("audio/")) {
        return (
            <>
                <div className="flex h-full aspect-square items-center justify-center bg-purple-50 hover:bg-purple-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`transform transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-80`}>
                            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm border border-white/30">
                                <Music className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOverlayOpen(true);
                    }}
                    className="absolute inset-0 z-10 bg-transparent cursor-pointer"
                />
                {renderOverlay(
                    <div className="flex flex-col items-center gap-6 rounded-xl bg-white p-8 backdrop-blur-md shadow-2xl">
                        <div className="rounded-full bg-purple-500/20 p-6">
                            <Music className="h-12 w-12 text-purple-400"/>
                        </div>
                        <audio src={url} controls autoPlay className="w-[320px] md:w-[400px]"/>
                    </div>
                )}
            </>
        );
    }

    return (
        <a
            href={url}
            className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
        >
            <ArrowDownToLine className="h-5 w-5"/>
            <span className="mt-1 text-[10px]">Download</span>
        </a>
    );
}