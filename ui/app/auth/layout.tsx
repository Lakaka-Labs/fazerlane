import { PropsWithChildren } from "react";
import Hyperspeed from "@/components/Hyperspeed";
import { hyperSpeedEffectOptions, HyperSpeedEffectOptions } from "@/lib/effect";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fazerlane | Authentication",
  description: "Access your Fazerlane account to continue.",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative">
      <div className={`h-screen w-screen overflow-hidden`}>
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      <div className="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-solid border-gray-500/20 bg-white/5 px-8 pt-10 pb-8 shadow-2xl backdrop-blur-md">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
