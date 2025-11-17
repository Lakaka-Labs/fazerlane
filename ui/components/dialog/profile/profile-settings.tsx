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
import { GeneralSettingsTab } from "./tabs/general-settings";

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
      <DialogContent className="flex h-screen max-w-2xl flex-col overflow-y-auto rounded-none px-4 lg:grid lg:h-fit lg:max-h-[90vh] lg:rounded-lg lg:px-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full gap-6 lg:gap-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="prompt">AI Context</TabsTrigger>
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileDetailsTab />
          </TabsContent>

          <TabsContent value="prompt">
            <CustomPromptTab />
          </TabsContent>

          <TabsContent value="api-key">
            <ApiKeyTab />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettingsTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
