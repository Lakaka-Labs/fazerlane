"use client";

import React, { useEffect, useState } from "react";
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
import { SignInFields, signInSchema } from "@/schemas/auth";
import Image from "next/image";
import appRoutes, { queryStateParams } from "@/config/routes";
import TextSeperator from "@/components/seperator/seperator-with-text";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AuthTitle from "@/components/title/auth.title";
import toast from "react-hot-toast";
import { usePersistStore } from "@/store/persist.store";
import { signInM } from "@/services/mutations/auth/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { googleLoginQ } from "@/services/queries/auth/auth";
import { parseAsString, useQueryState } from "nuqs";
import { setTokensToCookies } from "@/config/axios";

export default function Signin() {
  const router = useRouter();
  const [googleError, setGoogleError] = useQueryState(
    queryStateParams.error,
    parseAsString
  );

  const [showPassword, setShowPassword] = useState(false);

  const signInForm = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const { setSession, setToken, setUser } = usePersistStore((state) => state);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: signInM,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Logged in successfully!");
        signInForm.reset();
        if (data.data) {
          setUser(data.data.user);
          setToken({
            jwt: data.data.jwt,
            refreshToken: data.data.refreshToken,
          });
          setTokensToCookies(data.data.jwt, data.data.refreshToken);
          setSession({
            jwt: data.data.jwt,
            refreshToken: data.data.refreshToken,
            user: data.data.user,
          });
        }
        toast.success("Redirecting to dashboard...");
        router.push(appRoutes.dashboard.user.lanes);
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

  async function onSignIn(values: SignInFields) {
    const payload = {
      email: values.email,
      password: values.password,
    };

    await mutateAsync(payload);
  }

  function googleOAuth() {
    try {
      googleLoginQ();
    } catch (error) {
      toast.error(
        "Failed to initiate Google OAuth: " + (error as Error).message
      );
    }
  }

  useEffect(() => {
    if (googleError) {
      toast.error(decodeURIComponent(googleError));
      setGoogleError(null);
    }
  }, [googleError]);

  return (
    <div className="flex flex-col gap-5">
      <AuthTitle title="Welcome Back, Champ!" />

      <Button variant="outline" className="w-full gap-2" onClick={googleOAuth}>
        <Image
          src={"/icons/google-icon.svg"}
          alt="google icon"
          width={16}
          height={16}
        />
        Continue with Google
      </Button>

      <TextSeperator text="OR" />

      <Form {...signInForm}>
        <form
          onSubmit={signInForm.handleSubmit(onSignIn)}
          className="space-y-4"
        >
          <FormField
            control={signInForm.control}
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
          <div>
            <div className="flex gap-2">
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
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
            <div className="mt-2 text-right">
              <Link
                href={appRoutes.auth.forgotPassword}
                className="text-primary text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            disabled={isPending}
            type="submit"
            size={"lg"}
            className="w-full"
          >
            {isPending ? "Signing in..." : "Sign In"}
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
