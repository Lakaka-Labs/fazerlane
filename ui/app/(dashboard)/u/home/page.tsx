import LearnCard from "@/components/cards/learn/learn.card";
import { Plus } from "lucide-react";
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

export default function DUserHome() {
  return (
    <div>
      <Tabs defaultValue="account" className="gap-6">
        <div className="flex items-center justify-between">
          <TabsList className="h-fit gap-4 rounded-[6px] p-4">
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

          <div className="">
            <Select>
              <SelectTrigger className="w-[120px] border-[#80808033] text-sm font-normal shadow-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="created">
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] border-2 border-solid border-[#80808033]">
              <div className="flex items-center justify-center rounded-full bg-black p-7">
                <Plus size={16} color="white" />
              </div>
              <p className="text-2xl font-normal text-black">Create New Lane</p>
            </div>
            {Array.from({ length: 8 }).map((_, index) => (
              <LearnCard key={index} />
            ))}
            {/* <div className="h-full overflow-y-auto p-5">
          <div className="relative z-20 h-[300px] w-full rounded-2xl bg-red-500 px-4 py-6 shadow-2xl">
            <YoutubeVideo url="https://www.youtube.com/watch?v=TWEL-M-6818&t=1541s" />
          </div>
          <div>
            <h2>Assignment</h2>
          </div>
          <Button size={"xl"} className="w-full">
            <Plus size={48} />
          </Button>
        </div> */}
          </div>
        </TabsContent>
        <TabsContent value="added">Content for Added Lane</TabsContent>
        <TabsContent value="featured">Content for Featured Lane</TabsContent>
      </Tabs>
    </div>
  );
}

const tabsTriggerArr = [
  { label: "Created Lane", value: "created" },
  { label: "Added Lane", value: "added" },
  { label: "Featured Lane", value: "featured" },
];
