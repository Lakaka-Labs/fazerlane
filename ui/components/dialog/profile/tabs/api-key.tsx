"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiKeyFields, apiKeySchema } from "@/schemas/profile";
import {
  updateApiKeyM,
  // deleteApiKeyM,
} from "@/services/mutations/profile/update.profile";

export function ApiKeyTab() {
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKeyForm = useForm<ApiKeyFields>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
    },
  });

  const { isPending: isUpdating, mutateAsync: updateApiKey } = useMutation({
    mutationFn: updateApiKeyM,
    onSuccess: (data) => {
      if (data.message) {
        toast.success("API key updated successfully!");
        apiKeyForm.reset();
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Unexpected error");
      }
    },
  });

  // const { isPending: isDeleting, mutateAsync: deleteApiKey } = useMutation({
  //   mutationFn: deleteApiKeyM,
  //   onSuccess: (data) => {
  //     if (data.message === "success") {
  //       toast.success("API key removed successfully!");
  //     }
  //   },
  //   onError: (error) => {
  //     if (axios.isAxiosError(error)) {
  //       toast.error(error.response?.data.message || "Something went wrong");
  //     } else {
  //       toast.error("Unexpected error");
  //     }
  //   },
  // });

  async function onSubmit(values: ApiKeyFields) {
    await updateApiKey(values);
  }

  // async function handleDeleteApiKey() {
  //   await deleteApiKey();
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-brand-text/60 text-sm">
          Manage your API key for external integrations
        </p>
      </div>

      <Form {...apiKeyForm}>
        <form
          onSubmit={apiKeyForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={apiKeyForm.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your API key"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Your API key will be encrypted and stored securely
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            {/* <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteApiKey}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              <Trash2 className="size-4" />
              {isDeleting ? "Removing..." : "Remove Key"}
            </Button> */}
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Saving..." : "Save API Key"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
