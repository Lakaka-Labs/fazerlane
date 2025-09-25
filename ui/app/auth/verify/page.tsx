"use client";

import { resendVerifyEmailM, verifyEmailM } from "@/api/mutations/profile";
import AuthTitle from "@/components/title/auth.title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import appRoutes from "@/config/routes";
import { usePersistStore } from "@/store/persist.store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Verification() {
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const userEmail = usePersistStore((state) => state.user.email);
  const [manualEmail, setManualEmail] = useState(false);
  const [promptedUserEmail, setPromptedUserEmail] = useState("");

  const vtoken = searchParams.get("token");

  const { isPending, mutateAsync } = useMutation({
    mutationFn: verifyEmailM,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Email verified successfully!");
        setIsVerified(true);
      }
    },
    onError: (error) => {
      setShowResend(true);
      setIsVerified(false);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Unexpected error");
      }
    },
  });

  const resendVerify = useMutation({
    mutationFn: resendVerifyEmailM,
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Verification email resent successfully!");
        setShowResend(false);
      }
    },
    onError: (error) => {
      setShowResend(true);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Unexpected error");
      }
    },
  });

  async function verifyEmail(token: string) {
    const payload = {
      token,
    };

    await mutateAsync(payload);
  }

  async function resendVerificationEmail() {
    if (userEmail) {
      await resendVerify.mutateAsync({ email: userEmail });
    }

    if (manualEmail && promptedUserEmail) {
      await resendVerify.mutateAsync({ email: promptedUserEmail });
    }

    if (!userEmail && !manualEmail) {
      toast.error("Please enter your email to resend verification.");
      setManualEmail(true);
    }
  }

  useEffect(() => {
    if (vtoken) {
      verifyEmail(vtoken);
    }
  }, [vtoken]);

  if (!vtoken) {
    return (
      <div className="flex flex-col gap-5">
        <AuthTitle title="Invalid Verification Link" />
        <p className="text-center italic">
          The verification link is invalid. Please check your email for the
          correct link, or request a new verification email.
        </p>
      </div>
    );
  }

  if (!isPending && isVerified) {
    return (
      <div className="flex flex-col gap-5">
        <AuthTitle title="Email Verified!" />
        <p className="text-center italic">
          Your email has been successfully verified. You can now close this tab
          and log in to your account.
        </p>
        <Button asChild size={"lg"} className="w-full">
          <Link href={appRoutes.auth.signIn}>Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <AuthTitle title="Email Verification" />

      {isPending && (
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle size={32} className="text-primary animate-spin" />
          <p className="text-center italic">
            Verifying your email, please wait...
          </p>
        </div>
      )}

      {showResend && (
        <div className="flex w-full flex-col gap-4">
          <p className="text-center italic">
            Verification failed or link expired.
          </p>

          {manualEmail && (
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={promptedUserEmail}
                onChange={(e) => {
                  setPromptedUserEmail(e.target.value);
                }}
              />
            </div>
          )}

          <Button
            size={"lg"}
            onClick={() => {
              resendVerificationEmail();
            }}
            className="w-full"
          >
            Resend Verification Email
          </Button>
        </div>
      )}
    </div>
  );
}
