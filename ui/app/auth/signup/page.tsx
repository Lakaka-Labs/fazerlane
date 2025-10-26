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
import { SignUpFields, signUpSchema } from "@/schemas/auth";
import Link from "next/link";
import appRoutes, { queryStateParams } from "@/config/routes";
import Image from "next/image";
import TextSeperator from "@/components/seperator/seperator-with-text";
import { Eye, EyeOff } from "lucide-react";
import AuthTitle from "@/components/title/auth.title";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { signUpM } from "@/api/mutations/auth/auth";
import { usePersistStore } from "@/store/persist.store";
import { useRouter } from "next/navigation";
import { googleLoginQ } from "@/api/queries/auth/auth";
import { parseAsString, useQueryState } from "nuqs";
import { setTokensToCookies } from "@/config/axios";

export default function Signup() {
  const router = useRouter();
  const [googleError, setGoogleError] = useQueryState(
    queryStateParams.error,
    parseAsString
  );

  const [showPassword, setShowPassword] = useState(false);
  const signUpForm = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", username: "", password: "", confirm: "" },
  });

  const { setSession, setToken, setUser } = usePersistStore((state) => state);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: signUpM,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Account created successfully!");
        signUpForm.reset();
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
        setTimeout(() => {
          toast.success("Redirecting to dashboard...");
          router.push(appRoutes.dashboard.user.lanes);
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

  async function onSignUp(values: SignUpFields) {
    const payload = {
      email: values.email,
      username: values.username,
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
      <AuthTitle title="Welcome to Fazerlane" />

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

      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSignUp)}
          className="space-y-4"
        >
          <FormField
            control={signUpForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signUpForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="fazername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signUpForm.control}
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
          <FormField
            control={signUpForm.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
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

          <Button
            disabled={isPending}
            type="submit"
            size={"lg"}
            className="w-full"
          >
            {isPending ? "Creating..." : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="text-center font-medium">
        Already have an account?{" "}
        <Link
          href={appRoutes.auth.signIn}
          className="text-primary font-semibold"
        >
          Sign In!
        </Link>
      </p>
    </div>
  );
}
