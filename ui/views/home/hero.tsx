import Hyperspeed from "@/components/Hyperspeed";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { CheckCircleIcon, Pill, UserX } from "lucide-react";
// import { PillStatus } from "@/components/ui/kibo-ui/pill";
// import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { HyperSpeedEffectOptions, hyperSpeedEffectOptions } from "@/lib/effect";
import Link from "next/link";
import appRoutes from "@/config/routes";

export default function HeroHome() {
  return (
    <main className={`flex flex-col justify-between h-screen font-lato`}>
      <div className={`absolute w-screen h-screen overflow-hidden -z-10`}>
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      <header className={`flex justify-center absolute top-8 w-full`}>
        <nav className={`flex justify-between py-2 px-8 z-10 w-3/4`}>
          <Logo />
          {/*<div>*/}
          {/*    <Button variant={"secondary"} className={`border border-black/65`}>Sign in</Button>*/}
          {/*</div>*/}
        </nav>
      </header>

      <div
        className={
          "flex-1 justify-center items-center flex flex-col gap-6 text-center"
        }
      >
        {/*<Badge className={`rounded-full bg-gray-300 text-base text-black px-4 py-1 font-light`}>*/}
        {/*    <Image src={"/doom.png"} alt={"logo"} width={250} height={250} className={"w-10"}/>*/}
        {/*    Inspired By MfDoom*/}
        {/*</Badge>*/}
        <h1 className={"text-5xl font-bold"}>
          Follow the lane. The lane is your guide.
        </h1>
        <p className={`text-lg max-w-xl text-black/65`}>
          Peddle on the floor, thirsty for a score? Fazerlane is the path. We
          turn endless YouTube tutorials into actionable challenges, so you can
          stop just watching and start doing.
          {/*Submit your progress in any form and master skills by getting your*/}
          {/*hands dirty.*/}
        </p>
        <Button asChild size={"xl"} className={``}>
          <Link href={appRoutes.auth.signIn}>Get on the Lane</Link>
        </Button>
      </div>
    </main>
  );
}
