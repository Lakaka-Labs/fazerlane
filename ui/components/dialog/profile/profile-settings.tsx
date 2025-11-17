"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileDetailsTab } from "./tabs/profile-details";
import { CustomPromptTab } from "./tabs/custom-prompt";
import { ApiKeyTab } from "./tabs/api-key";
// import { GeneralSettingsTab } from "./tabs/general-settings";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileSettingsDialog({
  open,
  onOpenChange,
}: ProfileSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-brand-border flex max-h-[80dvh] max-w-[90%] flex-col rounded-md border-2 border-solid px-4 py-4 md:max-w-2xl md:px-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>

        <div className="relative w-full gap-6 overflow-y-auto lg:gap-4">
          <div className="flex flex-col gap-4 lg:pr-2">
            <ProfileDetailsTab />
            <CustomPromptTab />
            <ApiKeyTab />
            {/* <TabsContent value="general">
              <GeneralSettingsTab />
            </TabsContent> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
