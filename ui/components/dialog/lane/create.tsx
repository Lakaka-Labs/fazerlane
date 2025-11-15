"use client";

import { Button } from "@/components/ui/button";
import { Asterisk, Dot, Plus } from "lucide-react";
import {
  Dialog,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import appRoutes from "@/config/routes";
import { createLane, LanesData } from "@/services/mutations/lane/create";

interface CreateLaneDialogProps {
  customTrigger?: React.ReactNode;
}

export default function CreateLaneDialog({
  customTrigger = false,
}: CreateLaneDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async (data: LanesData) => await createLane(data),
    onError: (error) => {
      toast.error((error.message as string) || "Failed to create lane");
    },
  });

  const createLaneForm = useForm<CreateLaneFields>({
    resolver: zodResolver(createLaneSchema),
    defaultValues: { youtubeLink: "", startTime: "", endTime: "" },
  });

  async function handleCreateLane(data: CreateLaneFields) {
    if (!data.youtubeLink || !isValidYouTubeUrl(youtubeLink)) {
      toast.error("Please provide a valid YouTube link.");
      return;
    }

    await mutate
      .mutateAsync({
        youtube: data.youtubeLink,
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.endTime && { endTime: data.endTime }),
      })
      .then(async (res) => {
        if (res.laneId) {
          toast.success("Lane created successfully!");
          createLaneForm.reset();
          await queryClient.invalidateQueries({ queryKey: ["get-lanes"] });
          setOpen(false);
          // router.push(
          //   `${appRoutes.dashboard.user.progress}?laneId=${res.laneId}`
          // );
        }
      });
  }

  const youtubeLink = createLaneForm.watch("youtubeLink");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4 rounded-xl lg:h-full">
        {customTrigger ? (
          <DialogTrigger className="bg-primary flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full shadow-lg md:h-[75px] md:w-[75px]">
            <Plus size={28} color="white" />
          </DialogTrigger>
        ) : (
          <DialogTrigger className="flex h-full w-full max-w-[270px] cursor-pointer flex-col items-center justify-center gap-7">
            <span className="flex items-center justify-center rounded-full bg-black p-7">
              <Plus size={16} color="white" />
            </span>
            <p className="text-2xl font-normal text-black">Create New Lane</p>
            <p className="text-brand-black/60 text-sm font-normal">
              Turn any YouTube video into a learning path, and let AI guide your
              progress.
            </p>
          </DialogTrigger>
        )}

        <DialogContent className="border-brand-border max-w-sm border-2 border-solid md:max-w-2xl">
          <Form {...createLaneForm}>
            <form
              onSubmit={createLaneForm.handleSubmit(handleCreateLane)}
              className="flex flex-col gap-3"
            >
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
                          Paste in a YouTube URL below to be used to create a
                          new lane
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

                <div className="text-sm font-light md:text-base">
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
                  disabled={mutate.isPending}
                  type="submit"
                  className="mt-4"
                  // className="h-9 rounded-[6px] bg-black px-4 hover:bg-black/50"
                >
                  {mutate.isPending ? "Creating..." : "Create Lane"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

const timeRegex = /^(?:(\d+)m(?:([0-5]?\d)s)?|([0-5]?\d)s)$/;

// const TimeString = z.string().regex(timeRegex, {
//   message: 'Expected format "XmYs", "Xm" or "Ys" (seconds 0-59).',
// });
const TimeString = z
  .string()
  .optional()
  .refine((val) => !val || val === "" || timeRegex.test(val), {
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
