import LearnCard from "@/components/cards/learn/learn.card";
// import { Button } from "@/components/ui/button";
// import YoutubeVideo from "@/components/video/youtube";
// import { Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateLaneDialog } from "@/components/dialog/lane";
import { Dialog } from "@/components/ui/dialog";

export default function DUserHome() {
  return (
    <Dialog>
      <div>
        <Tabs defaultValue="created" className="gap-6">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <TabsList className="grid h-fit grid-cols-3 gap-1 rounded-[6px] p-2 shadow-md lg:inline-flex lg:gap-4 lg:p-4">
              {tabsTriggerArr.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!h-9 transform cursor-pointer !rounded-[6px] !px-4 !py-2 text-sm font-normal transition-all duration-200 ease-linear data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="w-full lg:w-[120px]">
              <Select>
                <SelectTrigger className="w-full border-[#80808033] text-sm font-normal shadow-lg lg:w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Recently Added</SelectItem>
                  <SelectItem value="dark">Completed</SelectItem>
                  <SelectItem value="system">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="created">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
              <CreateLaneDialog />

              {Array.from({ length: 8 }).map((_, index) => (
                <LearnCard key={index} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="added">Content for Added Lane</TabsContent>
          <TabsContent value="featured">Content for Featured Lane</TabsContent>
        </Tabs>
      </div>
    </Dialog>
  );
}

const tabsTriggerArr = [
  { label: "Created Lane", value: "created" },
  { label: "Added Lane", value: "added" },
  { label: "Featured Lane", value: "featured" },
];
