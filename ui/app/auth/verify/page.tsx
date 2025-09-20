"use client";

import AuthTitle from "@/components/title/auth.title";
import { Button } from "@/components/ui/button";
import appRoutes from "@/config/routes";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Verification() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const vtoken = searchParams.get("vtoken");

  async function verifyEmail(token: string) {
    setLoading(true);
    console.log("Verifying email with token:", token);

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsVerified(true);
        resolve(true);
      }, 5000);
    })
      .catch((error) => {
        setIsVerified(false);

        console.error("Verification failed:", error);
        setShowResend(true);
      })
      .finally(() => setLoading(false));
  }

  async function resendVerificationEmail() {
    setLoading(true);
    console.log("Resending verification email with token:");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Verification email resent");
        resolve(true);
      }, 3000);
    })
      .catch((error) => {
        console.error("Resend failed:", error);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (vtoken) {
      verifyEmail(vtoken).then(() => {
        console.log("Email verified");
      });
    }
  }, [vtoken]);

  if (!vtoken) {
    return (
      <div className="flex flex-col gap-5">
        <AuthTitle title="Invalid Verification Link" />
        <p className="text-center italic">
          The verification link is invalid. Please check your email for the
          correct link.
        </p>
      </div>
    );
  }

  if (!loading && isVerified) {
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

      {loading && (
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle size={32} className="text-primary animate-spin" />
          <p className="text-center italic">
            Verifying your email, please wait...
          </p>
        </div>
      )}

      {showResend && (
        <div className="w-full">
          <p className="mb-2 text-center italic">
            Verification failed or link expired.
          </p>
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
