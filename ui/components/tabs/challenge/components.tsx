import { BookOpen, History, ListChecks } from "lucide-react";

import { DetailsTab } from "./details";
import { SubmissionsTab } from "./submissions";
import { TasksTab } from "./tasks";

export * from "./challenge.ui";

export const challegeTabs = [
  {
    label: "Details",
    value: "details",
    icon: BookOpen,
    description: "Instructions and source references",
    component: DetailsTab,
  },
  {
    label: "Tasks",
    value: "tasks",
    icon: ListChecks,
    description: "Complete and submit the assignment",
    component: TasksTab,
  },
  {
    label: "Submissions",
    value: "submissions",
    icon: History,
    description: "Every attempt and its feedback",
    component: SubmissionsTab,
  },
];
