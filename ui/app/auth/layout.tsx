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
      <div className={`w-screen h-screen overflow-hidden `}>
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      <div className="h-screen fixed top-0 left-0 z-50 w-full flex justify-center items-center ">
        <div className="max-w-md backdrop-blur-md bg-white/5 w-full rounded-xl shadow-2xl px-8 pt-10 pb-8 border border-solid border-gray-500/20 flex flex-col gap-6">
          <h1 className="text-2xl tracking-tighter font-semibold text-center">
            Welcome to Fazerlane
          </h1>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
