import AskAIButton from "@/components/button/ask-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionContainer, SectionContent } from "./components";
import FileUpload from "@/components/input/file";
import { useState } from "react";
import { FileData } from "@/types/api/challenges/tasks";

interface TasksFormValues {
  text: string;
  comments: string;
}

export const TasksTab = () => {
  const [formValues, setFormValues] = useState<TasksFormValues>({
    text: "",
    comments: "",
  });

  const [files, setFiles] = useState<FileData[]>([]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof TasksFormValues
  ) {
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submissionData = {
      ...formValues,
      useMemory: true,
      files: files,
    };

    console.log("task submission", submissionData);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col gap-6">
        <SectionContent
          title="Task"
          content={`Submit a video of yourself performing 5 successful 'Advanced Stance' Nollie 180s.`}
        />
        <SectionContainer>
          <h2 className="text-base font-semibold">Upload</h2>
          <FileUpload fileLink={files} setFileLink={setFiles} />
        </SectionContainer>
        <SectionContainer>
          <h2 className="text-base font-semibold">Text</h2>
          <Textarea
            placeholder="Code and text submission here..."
            value={formValues.text}
            onChange={(e) => handleInputChange(e, "text")}
            className="border-brand-black/40 h-[100px] rounded-xl border border-solid"
          />
        </SectionContainer>
        <SectionContainer>
          <h2 className="text-base font-semibold">Comment</h2>
          <Textarea
            placeholder="Additional comments..."
            value={formValues.comments}
            onChange={(e) => handleInputChange(e, "comments")}
            className="border-brand-black/40 h-[100px] rounded-xl border border-solid"
          />
        </SectionContainer>
        <Button className="bg-primary rounded-[6px]">Submit</Button>
        <div className="flex justify-end">
          <AskAIButton />
        </div>
      </div>
    </form>
  );
};
