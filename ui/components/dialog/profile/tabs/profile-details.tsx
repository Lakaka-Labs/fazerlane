"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {usePersistStore} from "@/store/persist.store";
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
import {ProfileFields, profileSchema} from "@/schemas/profile";
import {updateProfileM} from "@/services/mutations/profile/update.profile";
import {useEffect} from "react";

export function ProfileDetailsTab() {
    const {setSession, session, setUser} = usePersistStore((state) => state);

    const initialUsername = session?.user?.username || "";

    const profileForm = useForm<ProfileFields>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: initialUsername,
        },
    });

    // Reset form when session loads
    useEffect(() => {
        if (session?.user?.username) {
            profileForm.reset({
                username: session.user.username,
            });
        }
    }, [session?.user?.username, profileForm]);

    const currentUsername = profileForm.watch("username");
    const isUnchanged = currentUsername === (session?.user?.username || "");
    const isEmpty = !currentUsername || currentUsername.trim() === "";

    const {isPending, mutateAsync: updateProfile} = useMutation({
        mutationFn: updateProfileM,
        onSuccess: (data) => {
            if (data.message) {
                setSession({...session, user: {...session.user, username: currentUsername}})
                setUser({...session.user, username: currentUsername})
                toast.success(
                    data.message ||
                    "Profile updated successfully"
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

    async function onSubmit(values: ProfileFields) {
        await updateProfile(values);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Profile</h2>
                <p className="text-brand-text/60 text-sm">
                    Update your personal information
                </p>
            </div>

            <Form {...profileForm}>
                <form
                    onSubmit={profileForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={profileForm.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="fazername" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={isPending || isUnchanged || isEmpty}
                            className="w-full sm:w-auto"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}