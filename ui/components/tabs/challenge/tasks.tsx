import { Button } from "@/components/ui/button";
import { SectionContainer, SectionContent } from "./components";
import FileUpload from "@/components/input/file";
import { useEffect, useRef, useState } from "react";
import { usePersistStore } from "@/store/persist.store";
import { SubmitTaskData } from "@/services/mutations/tasks/submit.task";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/routes";
import axios, { CancelTokenSource } from "axios";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CheckCircle2,
  CodeXml,
  FileMinus,
  Image,
  Info,
  Loader2,
  TextInitial,
  Video,
  Volume2,
  XCircle,
} from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

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

export const TasksTab = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<SSEComplete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const token = usePersistStore((state) => state.session.jwt);
  const setShowRateLimitPrompt = usePersistStore(
    (state) => state.setShowRateLimitPrompt
  );

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
        onDownloadProgress: (progressEvent) => {
          console.log("download progress event", progressEvent);
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
        const { done, value } = await reader.read();

        if (done) {
          setIsConnected(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            try {
              const message: SSEMessage = JSON.parse(data);

              switch (message.type) {
                case "started":
                  console.log("Challenge started:", message.challengeId);
                  toast.success("Task submitted successfully!");
                  break;

                case "chunk":
                  console.log("Received chunk:", message.data);
                  break;

                case "complete":
                  setIsComplete(true);
                  setFinalResult(message);
                  console.log("Challenge complete:", message);
                  setIsConnected(false);
                  break;

                case "error":
                  if (message.code === "AI_RATE_LIMIT") {
                    setShowRateLimitPrompt(true);
                  } else {
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
        console.log("Request canceled:", err.message);
        toast.error("Request canceled");
      } else {
        console.error("Error with SSE request:", err);
        // setError(
        //     err.response?.data?.message || err.message || "Failed to connect"
        // );
        toast.error(err.response?.data?.message || err.message || "Failed to connect")
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

  const { currentChallenge } = usePersistStore((store) => store);

  const [formValues, setFormValues] = useState<TasksFormValues>({
    text: "",
    comments: "",
    useMemory: false,
  });

  const [files, setFiles] = useState<string[]>([]);

  // Updated handler for rich text editor
  function handleRichTextChange(html: string) {
    setFormValues((prev) => ({
      ...prev,
      text: html,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentChallenge) {
      toast.error("No challenge selected.");
      return;
    }

    // Check if text has actual content
    const textContent = formValues.text.trim();

    if (
        (currentChallenge.submissionFormat.includes("text") && !textContent) ||
        (currentChallenge.submissionFormat.includes("code") && files.length < 1) ||
        (currentChallenge.submissionFormat.includes("image") && files.length < 1) ||
        (currentChallenge.submissionFormat.includes("video") && files.length < 1) ||
        (currentChallenge.submissionFormat.includes("audio") && files.length < 1)
    ) {
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

  const submissionFormatIcons: Record<
      string,
      { icon: React.ReactNode; tooltip: string }
  > = {
    video: { icon: <Video className="h-4 w-4" />, tooltip: "video" },
    image: { icon: <Image className="h-4 w-4" />, tooltip: "image" },
    text: { icon: <TextInitial className="h-4 w-4" />, tooltip: "text" },
    document: { icon: <FileMinus className="h-4 w-4" />, tooltip: "document" },
    audio: { icon: <Volume2 className="h-4 w-4" />, tooltip: "audio" },
    code: { icon: <CodeXml className="h-4 w-4" />, tooltip: "code" },
  };

  const errorRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [error]);

  useEffect(() => {
    if (isConnected && !isComplete && loadingRef.current) {
      loadingRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isConnected, isComplete]);

  useEffect(() => {
    if (isComplete && finalResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isComplete, finalResult]);

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const textContent = formValues.text.trim();

    if (
        currentChallenge &&
        ((currentChallenge.submissionFormat.includes("text") && !textContent) ||
            (currentChallenge.submissionFormat.includes("code") && files.length < 1) ||
            (currentChallenge.submissionFormat.includes("image") && files.length < 1) ||
            (currentChallenge.submissionFormat.includes("video") && files.length < 1) ||
            (currentChallenge.submissionFormat.includes("audio") && files.length < 1))
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [currentChallenge, formValues.text, files.length]);

  if (!currentChallenge) {
    return (
        <SectionContainer>
          <p className="bg-brand-background-dashboard text-brand-black flex h-20 items-center justify-center rounded-xl text-base font-normal italic">
            Please select a challenge from the sidebar.
          </p>
        </SectionContainer>
    );
  }

  return (
      <div className="flex flex-col gap-6">
        <SectionContent title="Task" content={currentChallenge.assignment} />

        {(currentChallenge.submissionFormat.includes("video") ||
            currentChallenge.submissionFormat.includes("image") ||
            currentChallenge.submissionFormat.includes("code") ||
            currentChallenge.submissionFormat.includes("audio")) && (
            <SectionContainer>
              <div className="flex w-full items-center justify-between">
                <h2 className="text-base font-semibold">Upload</h2>
                <div className="flex items-center gap-2">
                  {currentChallenge.submissionFormat.map((format) => {
                    if (format.toLowerCase() === "text") return null;
                    const iconData = submissionFormatIcons[format];
                    return iconData ? (
                        <div key={format} className="flex items-center gap-1" title={iconData.tooltip}>
                          {iconData.icon}
                          <span className="text-xs uppercase">{format}</span>
                        </div>
                    ) : null;
                  })}
                </div>
              </div>
              <FileUpload fileLink={files} setFileLink={setFiles} />
            </SectionContainer>
        )}

        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6">
          {currentChallenge.submissionFormat.includes("text") && (
              <SectionContainer>
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-base font-semibold">Text</h2>
                  <div className="flex items-center gap-2">
                    {currentChallenge.submissionFormat.map((format) => {
                      if (format.toLowerCase() !== "text") return null;
                      const iconData = submissionFormatIcons[format];
                      return iconData ? (
                          <div key={format} className="flex items-center gap-1" title={iconData.tooltip}>
                            {iconData.icon}
                            <span className="text-xs uppercase">{format}</span>
                          </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Rich Text Editor replaces Textarea */}
                <RichTextEditor
                    value={formValues.text}
                    onChange={handleRichTextChange}
                    placeholder="Code and text submission here..."
                    className="border-brand-black/40"
                />
              </SectionContainer>
          )}

          <SectionContainer>
            <div>
              <h2 className="text-base font-semibold">Memory</h2>
              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                <div className="text-base font-normal">
                  Enable this if you want the model to use stored context from
                  earlier interactions when evaluating your submission.
                </div>
                <ToggleGroup
                    value={formValues.useMemory ? "true" : "false"}
                    onValueChange={(value) => {
                      if (value) {
                        setFormValues((prev) => ({
                          ...prev,
                          useMemory: value === "true",
                        }));
                      }
                    }}
                    type="single"
                    className="w-full border border-solid border-black lg:w-fit"
                >
                  <ToggleGroupItem value="true" className="w-1/2 cursor-pointer lg:w-auto lg:px-4">
                    Yes
                  </ToggleGroupItem>
                  <ToggleGroupItem value="false" className="w-1/2 cursor-pointer lg:w-auto lg:px-4">
                    No
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </SectionContainer>

          <div className="flex items-center justify-between gap-4">
            <Button size={"lg"} disabled={isDisabled || isConnected || isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            {!isComplete && isConnected && (
                <Button
                    size={"lg"}
                    onClick={(e) => {
                      e.preventDefault();
                      cancel();
                    }}
                    disabled={!isConnected && !isSubmitting}
                    className="bg-brand-red rounded-tr-2xl rounded-tl px-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </Button>
            )}
          </div>
        </form>

        {/* Error, Loading, and Result sections remain the same */}
        <div className="flex flex-col gap-4">
          {error && (
              <div ref={errorRef} className="text-brand-red bg-brand-red/10 rounded p-4">
                {error}
              </div>
          )}

          {isConnected && !isComplete && (
              <div ref={loadingRef} className="flex items-start gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">Evaluating your challenge…</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  In progress
                </span>
                  </div>
                  <p className="text-xs text-foreground/70">
                    This usually takes a few seconds. You can continue reviewing other tasks while we validate.
                  </p>
                  <div className="mt-1 flex flex-col gap-1.5 text-[11px] text-foreground/60">
                    <div className="h-2.5 w-11/12 rounded-full bg-gradient-to-r from-primary/40 via-primary/20 to-muted" />
                    <div className="h-2.5 w-9/12 rounded-full bg-muted" />
                    <div className="h-2.5 w-7/12 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
          )}

          {isComplete && finalResult && (
              <div
                  ref={resultRef}
                  className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all duration-200 ${
                      finalResult.pass ? "border-emerald-400/70 bg-emerald-500/5" : "border-destructive/70 bg-destructive/5"
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {finalResult.pass ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {finalResult.pass ? "Challenge Passed" : "Challenge Failed"}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {finalResult.pass
                            ? "Nice work — all required checks were satisfied."
                            : "Some checks did not pass. Review the feedback below."}
                      </p>
                    </div>
                  </div>
                  <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                          finalResult.pass ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                      }`}
                  >
                {finalResult.pass ? "Passed" : "Failed"}
              </span>
                </div>
                <div className="mt-1 rounded-lg bg-background/60 px-3 py-2 text-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground/70">
                    <Info className="h-3.5 w-3.5 text-foreground/60" />
                    Feedback
                  </div>
                  <p className="text-sm italic text-foreground/90">{finalResult.feedback}</p>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};