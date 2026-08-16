"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
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

import { PasswordToggle } from "@/components/input/password-toggle";
import AuthTitle from "@/components/title/auth.title";
import { PasswordResetFields, passwordResetSchema } from "@/schemas/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { resetPasswordM } from "@/services/mutations/auth/profile";
import appRoutes from "@/config/routes";
import { InlineLoader } from "@/components/loader";

export default function PasswordReset() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const passwordResetForm = useForm<PasswordResetFields>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: resetPasswordM,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Password has been reset successfully!");
        passwordResetForm.reset();
        setTimeout(() => {
          router.push(appRoutes.auth.signIn);
        }, 500);
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

  async function onPasswordReset(values: PasswordResetFields) {
    const payload = {
      token: token as string,
      password: values.password,
    };

    await mutateAsync(payload);
  }

  if (!token) {
    return (
      <Suspense fallback={<InlineLoader fill />}>
        <div className="flex flex-col gap-5">
          <AuthTitle title="Invalid Reset Link" />
          <p className="text-center italic">
            The reset link is invalid. Please check your email for the correct
            link, or request a new password reset.
          </p>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<InlineLoader fill />}>
      <div className="flex flex-col gap-5">
        <AuthTitle title="Password Reset" />

        <Form {...passwordResetForm}>
          <form
            onSubmit={passwordResetForm.handleSubmit(onPasswordReset)}
            className="space-y-4"
          >
            <FormField
              control={passwordResetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl className="w-full">
                    <div className="flex w-full gap-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <PasswordToggle
                        visible={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                        label="new password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex gap-2">
                <FormField
                  control={passwordResetForm.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl className="w-full">
                        <div className="flex w-full gap-2">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <PasswordToggle
                            visible={showPassword}
                            onToggle={() => setShowPassword((prev) => !prev)}
                            label="password confirmation"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={isPending}
              type="submit"
              size={"lg"}
              className="w-full"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </Suspense>
  );
}
