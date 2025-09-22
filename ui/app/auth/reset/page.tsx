"use client";

import React, { useState } from "react";
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

import { Eye, EyeOff } from "lucide-react";
import AuthTitle from "@/components/title/auth.title";
import { PasswordResetFields, passwordResetSchema } from "@/schemas/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { resetPasswordM } from "@/api/mutations/profile";
import appRoutes from "@/config/routes";

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
          toast.success("Redirecting to sign in...");
          router.push(appRoutes.auth.signIn);
        }, 1000);
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
      <div className="flex flex-col gap-5">
        <AuthTitle title="Invalid Reset Link" />
        <p className="text-center italic">
          The reset link is invalid. Please check your email for the correct
          link, or request a new password reset.
        </p>
      </div>
    );
  }

  return (
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
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`border-border flex transform cursor-pointer items-center justify-center rounded-md border border-solid px-2 transition-all duration-200 ease-linear ${!showPassword ? "bg-border" : "bg-transparent"}`}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </span>
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
                        <span
                          onClick={() => setShowPassword((prev) => !prev)}
                          className={`border-border flex transform cursor-pointer items-center justify-center rounded-md border border-solid px-2 transition-all duration-200 ease-linear ${!showPassword ? "bg-border" : "bg-transparent"}`}
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </span>
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
  );
}
