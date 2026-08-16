"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {ApiKeyFields, apiKeySchema} from "@/schemas/profile";
import {
    updateApiKeyM,
    deleteApiKeyM,
} from "@/services/mutations/profile/update.profile";
import {usePersistStore} from "@/store/persist.store";

export function ApiKeyTab() {
    const store = usePersistStore((state) => state);
    const [showApiKey, setShowApiKey] = useState(false);

    const initialApiKey = store.session.user.apiKey || "";

    const apiKeyForm = useForm<ApiKeyFields>({
        resolver: zodResolver(apiKeySchema),
        defaultValues: {
            apiKey: initialApiKey,
        },
    });

    useEffect(() => {
        if (store.session?.user) {
            apiKeyForm.reset({
                apiKey: store.session.user.apiKey || "",
            });
        }
    }, [store.session?.user?.apiKey, apiKeyForm]);

    const currentApiKey = apiKeyForm.watch("apiKey");
    const isUnchanged = currentApiKey === initialApiKey;
    const isEmpty = !currentApiKey || currentApiKey.trim() === "";

    const {isPending: isUpdating, mutateAsync: updateApiKey} = useMutation({
        mutationFn: updateApiKeyM,
        onSuccess: (data) => {
            if (data.message) {
                store.setSession({
                    ...store.session,
                    user: {...store.session.user, apiKey: apiKeyForm.getValues("apiKey")}
                })
                store.setUser({...store.session.user, apiKey: apiKeyForm.getValues("apiKey")})
                toast.success(
                    data.message ||
                    "API key updated successfully"
                );
                // apiKeyForm.reset();
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

    const {isPending: isDeleting, mutateAsync: deleteApiKey} = useMutation({
        mutationFn: deleteApiKeyM,
        onSuccess: (data) => {
            if (data.message) {
                store.setSession({...store.session, user: {...store.session.user, apiKey: ""}})
                store.setUser({...store.session.user, apiKey: ""})
                apiKeyForm.setValue("apiKey", "")
                toast.success("API key removed successfully!");
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

    async function onSubmit(values: ApiKeyFields) {
        await updateApiKey(values);
    }

    async function handleDeleteApiKey() {
        await deleteApiKey();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">API Key</h2>
                <p className="text-brand-text/60 text-sm">
                    Manage your API key for external integrations
                </p>
                <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary w-fit text-sm font-medium underline underline-offset-2 hover:opacity-80"
                >
                    Get a Gemini API key
                </a>
            </div>

            <Form {...apiKeyForm}>
                <form
                    onSubmit={apiKeyForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={apiKeyForm.control}
                        name="apiKey"
                        render={({field}) => (
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
                                                <EyeOff className="size-4"/>
                                            ) : (
                                                <Eye className="size-4"/>
                                            )}
                                        </button>
                                    </div>
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteApiKey();
                            }}
                            disabled={isDeleting || isEmpty}
                            className="w-full px-4 sm:w-auto"
                        >
                            {isDeleting ? "Removing..." : "Remove"}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating || isUnchanged || isEmpty}
                            className="w-full sm:w-auto rounded-tl rounded-tr-xl"
                        >
                            {isUpdating ? "Saving..." : "Save API Key"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}