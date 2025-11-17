"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-brand-border flex h-full max-w-full flex-col rounded-none border-2 border-solid px-4 py-4 md:h-[350px] md:max-w-2xl md:rounded-md md:px-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="relative w-full gap-6 overflow-y-auto lg:gap-4"
        >
          <TabsList className="sticky top-0 grid min-h-11 w-full transform grid-cols-3 transition-all duration-200 ease-linear">
            <TabsTrigger value="profile" className="cursor-pointer">
              Profile
            </TabsTrigger>
            <TabsTrigger value="prompt" className="cursor-pointer">
              AI Context
            </TabsTrigger>
            <TabsTrigger value="api-key" className="cursor-pointer">
              API Key
            </TabsTrigger>
            {/* <TabsTrigger value="general">General</TabsTrigger> */}
          </TabsList>

          <div className="flex">
            <TabsContent value="profile">
              <ProfileDetailsTab />
            </TabsContent>
            <TabsContent value="prompt" className="pr-2">
              <CustomPromptTab />
            </TabsContent>
            <TabsContent value="api-key">
              <ApiKeyTab />
            </TabsContent>
            {/* <TabsContent value="general">
              <GeneralSettingsTab />
            </TabsContent> */}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
