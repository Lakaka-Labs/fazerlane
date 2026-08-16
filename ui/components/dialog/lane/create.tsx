"use client";

import { Button } from "@/components/ui/button";
import { Plus, Youtube } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { createLane, LanesData } from "@/services/mutations/lane/create";

/**
 * How the dialog is opened.
 *
 * `panel` is the empty state — the only thing on the page when you have no
 * lanes, so the trigger is the whole invitation. `button` is the page header's
 * action once the grid has something in it. `fab` is that same action on narrow
 * screens, where the header scrolls away from an infinite list.
 */
type CreateLaneTrigger = "panel" | "button" | "fab";

interface CreateLaneDialogProps {
  variant?: CreateLaneTrigger;
}

export default function CreateLaneDialog({
  variant = "panel",
}: CreateLaneDialogProps) {
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
  const hasPreview = Boolean(youtubeLink) && isValidYouTubeUrl(youtubeLink);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant === "fab" && (
        <DialogTrigger
          aria-label="Create a new lane"
          className="bg-primary text-primary-foreground focus-visible:ring-brand-text/30 flex size-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
        >
          <Plus className="size-6" strokeWidth={2.4} />
        </DialogTrigger>
      )}

      {variant === "button" && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" strokeWidth={2.4} />
            New lane
          </Button>
        </DialogTrigger>
      )}

      {variant === "panel" && (
        /* The empty state's whole job is to make the one useful action
           unmissable, so the trigger *is* the panel rather than a button
           parked inside one. Dashed border marks it as a slot waiting to be
           filled — the same signal the challenge workspace's empty states use.
           Being a control, it is one of the few things that earns the signature
           corner; the tile inside it is decoration and stays plain. */
        <DialogTrigger className="group border-brand-divider hover:border-brand-text/25 hover:bg-brand-text/[0.02] focus-visible:ring-brand-text/25 flex w-full max-w-md cursor-pointer flex-col items-center gap-5 rounded-2xl rounded-tl-[2rem] border border-dashed px-6 py-12 text-center transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none sm:px-10">
          <span className="bg-brand-text text-brand-white flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
            <Plus className="size-6" strokeWidth={2.2} />
          </span>

          <span className="flex flex-col gap-2">
            <span className="text-brand-text text-xl font-bold tracking-tight">
              Create your first lane
            </span>
            <span className="text-brand-text/55 text-sm leading-relaxed font-normal">
              Turn any YouTube tutorial into a learning path, and let AI guide
              your progress.
            </span>
          </span>
        </DialogTrigger>
      )}

      {/* Header and footer are pinned and only the fields scroll, so the submit
          button stays reachable on short screens once a video preview and three
          fields are stacked above it. */}
      <DialogContent className="border-brand-divider flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-2xl border border-solid p-0 md:max-w-2xl">
        <DialogHeader className="border-brand-divider flex-row items-start gap-3 border-b border-solid px-5 py-4 pr-12 text-left md:px-6 md:pr-12">
          <span className="bg-brand-red text-brand-white flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Youtube className="size-[18px]" strokeWidth={2} />
          </span>

          <div className="flex min-w-0 flex-col gap-1">
            <DialogTitle className="text-brand-text text-lg font-bold tracking-tight">
              Create a lane
            </DialogTitle>
            <DialogDescription className="text-brand-text/50 text-xs leading-relaxed">
              Paste a YouTube tutorial and Fazerlane breaks it into challenges
              you work through in order.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...createLaneForm}>
          <form
            onSubmit={createLaneForm.handleSubmit(handleCreateLane)}
            className="flex min-h-0 flex-col"
          >
            {/* Children never shrink — a scrolling flex column would otherwise
                pay for its overflow by compressing whatever gives way first
                instead of scrolling. */}
            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5 md:px-6 [&>*]:shrink-0">
              {/* The frame is 16:9 and everything the player renders into it is
                  forced to fill it. `aspect-video` alone was not enough: it
                  fixes the box, but react-player's own wrapper and iframe size
                  themselves, so the video sat in the frame as a letterbox
                  strip. `shrink-0` keeps the frame from paying for the column's
                  overflow, which it would otherwise do by flattening the one
                  box whose height is derived rather than intrinsic. */}
              {hasPreview && (
                <div className="border-brand-divider bg-brand-deep-black aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-solid [&_iframe]:size-full [&>*]:size-full">
                  <YoutubeVideo url={youtubeLink} playing={false} />
                </div>
              )}

              <FormField
                control={createLaneForm.control}
                name="youtubeLink"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel className="text-brand-text text-sm font-semibold">
                      YouTube link
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={createLaneForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel className="text-brand-text text-sm font-semibold">
                        Start time
                        <span className="text-brand-text/40 font-normal">
                          optional
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="30m10s" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createLaneForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel className="text-brand-text text-sm font-semibold">
                        End time
                        <span className="text-brand-text/40 font-normal">
                          optional
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="1h30m10s" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-brand-text/45 -mt-2 text-xs leading-relaxed">
                Leave both blank to use the whole video. Times take the form
                <span className="text-brand-text/70 font-semibold">
                  {" "}
                  1h30m10s
                </span>
                .
              </p>

              {/* Recessed panel, same as the challenge workspace uses for
                  supporting detail — present, but never competing with the
                  fields above it. */}
              <div className="border-brand-divider bg-brand-background-dashboard rounded-xl border border-solid px-4 py-3.5">
                <h3 className="text-brand-text/45 text-[10px] font-bold tracking-[0.12em] uppercase">
                  Good to know
                </h3>

                <ul className="text-brand-text/60 mt-2.5 flex flex-col gap-1.5 text-xs leading-relaxed">
                  {createLaneNotes.map((note) => (
                    <li key={note} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="bg-brand-text/25 mt-[7px] size-1 shrink-0 rounded-full"
                      />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Side by side, the oversized corner brackets the pair rather than
                repeating on both: leading button top-left, trailing button
                top-right. Below `sm` the footer stacks, so each button is a run
                of one again and keeps the default corner. */}
            <DialogFooter className="border-brand-divider gap-2 border-t border-solid px-5 py-4 md:px-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                disabled={mutate.isPending}
                type="submit"
                className="sm:rounded-tl sm:rounded-tr-xl"
              >
                {mutate.isPending ? "Creating..." : "Create Lane"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const createLaneNotes = [
  "Only public YouTube videos are supported",
  "Recently uploaded videos may not be available to import",
  "Tutorials give the best results — Fazerlane needs something to teach",
];

// const timeRegex = /^(?:(\d+)m(?:([0-5]?\d)s)?|([0-5]?\d)s)$/;
const timeRegex = /^(?:(\d+)h)?(?:(0|[1-5]?\d)m)?(?:(0|[1-5]?\d)s)?$/;

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
