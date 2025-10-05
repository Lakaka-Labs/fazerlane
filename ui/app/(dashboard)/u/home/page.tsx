import LearnCard from "@/components/cards/learn/learn.card";
// import { Button } from "@/components/ui/button";
// import YoutubeVideo from "@/components/video/youtube";
// import { Plus } from "lucide-react";

export default function DUserHome() {
  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-6">
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
  );
}
