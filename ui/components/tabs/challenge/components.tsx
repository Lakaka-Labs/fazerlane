import { cn } from "@/lib/utils";
import { DetailsTab } from "./details";
import { SubmissionsTab } from "./submissions";
import { TasksTab } from "./tasks";
import ReactMarkdown from "react-markdown";

export const SectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-4">
      {children}
    </div>
  );
};

export const SectionContent = ({
  title,
  content,
  contentClassName,
}: {
  title: string;
  content: string;
  contentClassName?: string;
}) => {
  return (
    <SectionContainer>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className={cn("text-base font-normal", contentClassName)}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </SectionContainer>
  );
};

export const challegeTabs = [
  { label: "Details", value: "details", component: DetailsTab },
  { label: "Tasks", value: "tasks", component: TasksTab },
  { label: "Submissions", value: "submissions", component: SubmissionsTab },
];
