import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { challegeTabs, SectionContainer, SectionContent } from "./components";
import FileUpload from "@/components/input/file";
import { useState } from "react";
import { usePersistStore } from "@/store/persist.store";
import {
  submitTask,
  SubmitTaskData,
  SubmitTaskQuery,
} from "@/api/mutations/tasks/submit.task";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { queryStateParams } from "@/config/routes";

interface TasksFormValues {
  text: string;
  comments: string;
}

export const TasksTab = () => {
  const queryClient = useQueryClient();

  const [, setTab] = useQueryState(queryStateParams.tab, {
    defaultValue: challegeTabs[0].value,
  });

  const {
    currentChallenge,
    //  setCurrentChallengeTab
  } = usePersistStore((store) => store);

  const [formValues, setFormValues] = useState<TasksFormValues>({
    text: "",
    comments: "",
  });

  const [files, setFiles] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: (submissionData: SubmitTaskData & SubmitTaskQuery) =>
      submitTask(submissionData),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to submit task");
    },
  });

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

    const submissionData = {
      ...formValues,
      useMemory: true,
      files: files,
      challenge_id: currentChallenge.id,
    };

    const res = await mutation.mutateAsync(submissionData);

    if (res) {
      toast.success("Task submitted successfully!");
      await queryClient.invalidateQueries({ queryKey: ["get-challenges"] });
      // setCurrentChallengeTab(challegeTabs[2].value);
      setTab(challegeTabs[2].value);
    }

    console.log("task submission", submissionData);
  }

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
        currentChallenge.submissionFormat.includes("audio")) && (
        <SectionContainer>
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base font-semibold">Upload</h2>
            <span className="uppercase">
              [{currentChallenge.submissionFormat}]
            </span>
          </div>

          <FileUpload fileLink={files} setFileLink={setFiles} />
        </SectionContainer>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6">
        {(currentChallenge.submissionFormat.includes("text") ||
          currentChallenge.submissionFormat.includes("code")) && (
          <SectionContainer>
            <div className="flex w-full items-center justify-between">
              <h2 className="text-base font-semibold">Text</h2>

              <span>[{currentChallenge.submissionFormat}]</span>
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
          <h2 className="text-base font-semibold">Comment</h2>
          <Textarea
            placeholder="Additional comments..."
            value={formValues.comments}
            onChange={(e) => handleInputChange(e, "comments")}
            className="border-brand-black/40 h-[100px] rounded-xl border border-solid"
          />
        </SectionContainer>
        <Button
          size={"lg"}
          disabled={mutation.isPending}
          // className="bg-primary rounded-[6px]"
        >
          {mutation.isPending ? "Submitting" : "Submit"}
        </Button>
      </form>
    </div>
  );
};
