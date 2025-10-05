import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateChallengeDialog() {
  return (
    <div>
      <DialogTrigger asChild>
        <Button className="flex transform items-center gap-1.5 rounded-full bg-gray-300 text-sm !font-semibold text-black shadow-lg transition-colors duration-200 ease-linear hover:bg-gray-600 hover:text-white">
          <Plus scale={24} className="size-5" />
          <span>Create</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create new challenge from Youtube tutorial</DialogTitle>
          <DialogDescription>
            Fill in the information below to create your new challenge.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Tutorial Link</Label>
            <Input
              id="youtubeLink"
              name="youtubeLink"
              placeholder="https://www.youtube.com/watch?v="
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Challenge</Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
