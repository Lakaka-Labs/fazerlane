"use client";

import { Button } from "@/components/ui/button";
import { Asterisk, Dot, Plus } from "lucide-react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import YoutubeVideo from "@/components/video/youtube";

export default function CreateLaneDialog() {
  const createLaneForm = useForm<CreateLaneFields>({
    resolver: zodResolver(createLaneSchema),
    defaultValues: { youtubeLink: "", startTime: "", endTime: "" },
  });

  async function handleCreateLane(_params: CreateLaneFields) {}

  const youtubeLink = createLaneForm.watch("youtubeLink");

  // const embedUrl = getYouTubeEmbedUrl(youtubeLink || "");

  return (
    <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4 rounded-[12px] border-2 border-solid border-[#80808033] shadow-lg lg:h-full">
      <Form {...createLaneForm}>
        <form onSubmit={createLaneForm.handleSubmit(handleCreateLane)}>
          <DialogTrigger className="flex h-full w-full flex-col items-center justify-center gap-4">
            <span className="flex items-center justify-center rounded-full bg-black p-7">
              <Plus size={16} color="white" />
            </span>
            <p className="text-2xl font-normal text-black">Create New Lane</p>
          </DialogTrigger>

          <DialogContent className="max-w-md border-2 border-solid border-[#80808033]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Create Lane
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              {youtubeLink && isValidYouTubeUrl(youtubeLink) && (
                <div className="h-[330px] w-full overflow-hidden rounded-[12px]">
                  <YoutubeVideo url={youtubeLink} />
                </div>
              )}

              <div>
                <FormField
                  control={createLaneForm.control}
                  name="youtubeLink"
                  render={({ field }) => (
                    <FormItem className="gap-3">
                      <FormLabel>
                        Paste in a YouTube URL below to be used to create a new
                        lane
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.youtube.com/watch?v="
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={createLaneForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="gap-3">
                      <FormLabel>Start Time (e.g., 1m10s)</FormLabel>
                      <FormControl>
                        <Input placeholder="1m10s" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createLaneForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="gap-3">
                      <FormLabel>End Time (e.g., 2m30s)</FormLabel>
                      <FormControl>
                        <Input placeholder="2m30s" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-base font-normal">
                <h3 className="flex items-center gap-1">
                  <Asterisk size={12} />
                  Notes
                </h3>
                <ul className="text-sm">
                  <li className="flex gap-1 pl-2">
                    <Dot />
                    Only public YouTube videos are supported
                  </li>
                  <li className="flex gap-1 pl-2">
                    <Dot />
                    Recently uploaded videos may not be available to import
                  </li>
                  <li className="flex gap-1 pl-2">
                    <Dot />
                    Upload only Youtube tutorials for good results
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="h-9 rounded-[6px] bg-black px-4 hover:bg-black/50"
              >
                Create Lane
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </div>
  );
}

const timeRegex = /^(?:(\d+)m(?:([0-5]?\d)s)?|([0-5]?\d)s)$/;

const TimeString = z.string().regex(timeRegex, {
  message: 'Expected format "XmYs", "Xm" or "Ys" (seconds 0-59).',
});

function isValidYouTubeUrl(url: string) {
  try {
    const parsed = new URL(url);
    const isYouTube =
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be");
    return isYouTube;
  } catch {
    return false;
  }
}

const createLaneSchema = z.object({
  youtubeLink: z.string().url("Invalid Link"),
  startTime: TimeString.optional(),
  endTime: TimeString.optional(),
});

type CreateLaneFields = z.infer<typeof createLaneSchema>;

// function getYouTubeEmbedUrl(url: string) {
//   const match = url.match(
//     /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
//   );
//   return match ? `https://www.youtube.com/embed/${match[1]}` : null;
// }
