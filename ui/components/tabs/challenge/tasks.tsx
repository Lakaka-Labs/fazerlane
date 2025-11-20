import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  CodeXml,
  FileMinus,
  Image,
  TextInitial,
  Video,
  Volume2,
} from "lucide-react";

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

interface SSEComplete {
  type: "complete";
  pass: boolean;
  feedback: string;
  challengeId: string;
}

type SSEMessage = SSEStarted | SSEChunk | SSEComplete;

export const TasksTab = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<SSEComplete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const token = usePersistStore((state) => state.session.jwt);

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

        // Split by newlines to process complete messages
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
        setError(
          err.response?.data?.message || err.message || "Failed to connect"
        );
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

  function handleInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof TasksFormValues
  ) {
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentChallenge) {
      toast.error("No challenge selected.");
      return;
    }

    if (
      (currentChallenge.submissionFormat.includes("text") &&
        !formValues.text) ||
      (currentChallenge.submissionFormat.includes("code") &&
        files.length < 1) ||
      (currentChallenge.submissionFormat.includes("image") &&
        files.length < 1) ||
      (currentChallenge.submissionFormat.includes("video") &&
        files.length < 1) ||
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

  // this is for scrolling to the bottom when these kini are available
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
      loadingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isConnected, isComplete]);

  useEffect(() => {
    if (isComplete && finalResult && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isComplete, finalResult]);
  // end

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (
      currentChallenge &&
      ((currentChallenge.submissionFormat.includes("text") &&
        !formValues.text) ||
        (currentChallenge.submissionFormat.includes("code") &&
          files.length < 1) ||
        (currentChallenge.submissionFormat.includes("image") &&
          files.length < 1) ||
        (currentChallenge.submissionFormat.includes("video") &&
          files.length < 1) ||
        (currentChallenge.submissionFormat.includes("audio") &&
          files.length < 1))
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
                  <div
                    key={format}
                    className="flex items-center gap-1"
                    title={iconData.tooltip}
                  >
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
                    <div
                      key={format}
                      className="flex items-center gap-1"
                      title={iconData.tooltip}
                    >
                      {iconData.icon}
                      <span className="text-xs uppercase">{format}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <Textarea
              placeholder="Code and text submission here..."
              value={formValues.text}
              onChange={(e) => handleInputChange(e, "text")}
              className="border-brand-black/40 h-[100px] rounded-xl border border-solid"
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
                <ToggleGroupItem
                  value="true"
                  className="w-1/2 cursor-pointer lg:w-auto lg:px-4"
                >
                  Yes
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="false"
                  className="w-1/2 cursor-pointer lg:w-auto lg:px-4"
                >
                  No
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </SectionContainer>

        <div className="flex items-center justify-between gap-4">
          <Button
            size={"lg"}
            disabled={isDisabled || isConnected || isSubmitting}
            className="flex-1"
          >
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
              className="bg-brand-red rounded px-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {error && (
          <div
            ref={errorRef}
            className="text-brand-red bg-brand-red/10 rounded p-4"
          >
            {error}
          </div>
        )}

        {isConnected && !isComplete && (
          <div
            ref={loadingRef}
            className="flex animate-pulse flex-col gap-2 border-l-4 border-gray-300 bg-gray-500/10 px-4 py-6"
          >
            <div className="h-7 w-32 rounded bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded bg-gray-300"></div>
              <div className="h-5 w-12 rounded bg-gray-300"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-5 w-20 rounded bg-gray-300"></div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-300"></div>
                <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                <div className="h-4 w-8/9 rounded bg-gray-300"></div>
                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        )}

        {isComplete && finalResult && (
          <div
            ref={resultRef}
            className={`flex flex-col gap-2 border-l-4 p-4 transition-all duration-200 ${finalResult.pass ? "border-brand-bright-green bg-brand-bright-green/10" : "bg-brand-red/10 border-brand-red"}`}
          >
            <h3 className="text-lg font-bold">Final Result:</h3>
            <p>
              <strong>Pass:</strong> {finalResult.pass ? "Yes" : "No"}
            </p>
            <div>
              <strong>Feedback:</strong>{" "}
              <p className="italic">{finalResult.feedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
