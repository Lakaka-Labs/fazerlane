"use client";

import React from "react";
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
import { ForgotPasswordFields, forgotPasswordSchema } from "@/schemas/auth";
import appRoutes from "@/config/routes";

import Link from "next/link";
import AuthTitle from "@/components/title/auth.title";

export default function ForgotPassword() {
  const forgotPasswordForm = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onForgotPassword(values: ForgotPasswordFields) {
    console.log("Sign-In", values);
    forgotPasswordForm.reset();
  }

  return (
    <div className="flex flex-col gap-5">
      <AuthTitle title="Reset Your Password" />

      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)}
          className="space-y-4"
        >
          <FormField
            control={forgotPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size={"lg"} className="w-full">
            Reset
          </Button>
        </form>
      </Form>

      <p className="text-center font-medium">
        Don't have an account?{" "}
        <Link
          href={appRoutes.auth.signUp}
          className="text-primary font-semibold"
        >
          Sign Up!
        </Link>
      </p>
    </div>
  );
}
