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
import { SignUpFields, signUpSchema } from "@/schemas/auth";
import Link from "next/link";
import appRoutes from "@/config/routes";
import Image from "next/image";
import TextSeperator from "@/components/seperator/seperator-with-text";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const signUpForm = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  function onSignUp(values: SignUpFields) {
    console.log("Sign-Up", values);
    signUpForm.reset();
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
                  <Input placeholder="you@example.com" {...field} />
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

          {/* <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...signUpForm.register("human")}
              className="h-4 w-4"
            />
            <Label className="text-sm">Verify you are human</Label>
          </div>
          <FormMessage>
            {signUpForm.formState.errors.human?.message}
          </FormMessage> */}

          <Button type="submit" size={"lg"} className="w-full">
            Create account
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
