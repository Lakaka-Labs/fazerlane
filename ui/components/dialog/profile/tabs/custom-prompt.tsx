"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {CustomPromptFields, customPromptSchema} from "@/schemas/profile";
import {
    deleteCustomPromptM,
    updateCustomPromptM,
} from "@/services/mutations/profile/update.profile";
import {usePersistStore} from "@/store/persist.store";

export function CustomPromptTab() {
    const store = usePersistStore((state) => state);

    const initialCustomPrompt = store.session.user.customPrompt || "";

    const customPromptForm = useForm<CustomPromptFields>({
        resolver: zodResolver(customPromptSchema),
        defaultValues: {
            customPrompt: initialCustomPrompt,
        },
    });

    const currentCustomPrompt = customPromptForm.watch("customPrompt");
    const isUnchanged = currentCustomPrompt === initialCustomPrompt;
    const isEmpty = !currentCustomPrompt || currentCustomPrompt.trim() === "";

    const {isPending, mutateAsync: updateCustomPrompt} = useMutation({
        mutationFn: updateCustomPromptM,
        onSuccess: (data) => {
            if (data.message) {
                store.setSession({...store.session, user: {...store.session.user, customPrompt: currentCustomPrompt}})
                store.setUser({...store.session.user, customPrompt: currentCustomPrompt})
                toast.success(
                    data.message ||
                    "Custom prompt updated successfully"
                );
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

    const {isPending: isDeleting, mutateAsync: deleteCustomPrompt} =
        useMutation({
            mutationFn: deleteCustomPromptM,
            onSuccess: (data) => {
                if (data.message) {
                    store.setSession({...store.session, user: {...store.session.user, customPrompt: ""}})
                    store.setUser({...store.session.user, customPrompt: ""})
                    customPromptForm.setValue(  "customPrompt", "")
                    toast.success(
                        data.message ||
                        "Custom prompt deleted successfully, please login again to see changes!"
                    );
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

    async function onSubmit(values: CustomPromptFields) {
        await updateCustomPrompt(values);
    }

    async function handleDeleteCustomPrompt() {
        await deleteCustomPrompt();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">AI Context</h2>

                <p className="text-brand-text/60 text-sm">
                    Provide additional context for AI assistance while using Fazerlane
                </p>
            </div>

            <Form {...customPromptForm}>
                <form
                    onSubmit={customPromptForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={customPromptForm.control}
                        name="customPrompt"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Custom Prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., I'm learning web development and prefer React with TypeScript..."
                                        className="min-h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This context will be used to personalize your AI interactions
                                </FormDescription>
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
                                handleDeleteCustomPrompt();
                            }}
                            disabled={isDeleting || isEmpty}
                            className="w-full px-4 sm:w-auto"
                        >
                            {isDeleting ? "Removing..." : "Remove"}
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending || isUnchanged || isEmpty}
                            className="w-full sm:w-auto"
                        >
                            {isPending ? "Saving..." : "Save Prompt"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}