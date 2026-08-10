"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePersistStore } from "@/store/persist.store";

export function RateLimitPromptDialog() {
  const router = useRouter();
  const showRateLimitPrompt = usePersistStore(
    (state) => state.showRateLimitPrompt
  );
  const setShowRateLimitPrompt = usePersistStore(
    (state) => state.setShowRateLimitPrompt
  );

  function handleGoToSettings() {
    setShowRateLimitPrompt(false);
    router.push("/u/settings#api-key");
  }

  return (
    <Dialog open={showRateLimitPrompt} onOpenChange={setShowRateLimitPrompt}>
      <DialogContent className="border-brand-border rounded-md border-2 border-solid">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Our shared AI key is at capacity
          </DialogTitle>
          <DialogDescription>
            We use a shared, rate-limited API key so everyone can try
            LeaseStash for free. It looks like that limit has been hit for
            now. To keep going without interruption, add your own free
            Gemini API key in Settings.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowRateLimitPrompt(false)}
            className="w-full sm:w-auto"
          >
            Maybe later
          </Button>
          <Button
            type="button"
            onClick={handleGoToSettings}
            className="w-full sm:w-auto"
          >
            Go to Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
