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
import { SignInFields, signInSchema } from "@/schemas/auth";
import Image from "next/image";
import appRoutes from "@/config/routes";
import TextSeperator from "@/components/seperator/seperator-with-text";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const signInForm = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSignIn(values: SignInFields) {
    console.log("Sign-In", values);
    signInForm.reset();
  }

  function googleOAuth() {
    console.log("Google OAuth");
  }

  return (
    <div className="flex flex-col gap-5">
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
          {/* <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...signInForm.register("human")}
              className="h-4 w-4"
            />
            <Label className="text-sm">Verify you are human</Label>
          </div> 
          <FormMessage>
            {signInForm.formState.errors.human?.message}
          </FormMessage> */}
          <Button type="submit" size={"lg"} className="w-full">
            Sign In
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
