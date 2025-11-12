import Hyperspeed from "@/components/Hyperspeed";
import { Button } from "@/components/ui/button";
// import { CheckCircleIcon, Pill, UserX } from "lucide-react";
// import { PillStatus } from "@/components/ui/kibo-ui/pill";
// import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { HyperSpeedEffectOptions, hyperSpeedEffectOptions } from "@/lib/effect";
import Link from "next/link";
import appRoutes from "@/config/routes";

export default function HeroHome() {
  return (
    <main className={`font-lato flex h-screen flex-col justify-between`}>
      <div className={`absolute -z-10 h-screen w-screen overflow-hidden`}>
        <Hyperspeed
          effectOptions={hyperSpeedEffectOptions as HyperSpeedEffectOptions}
        />
      </div>

      <header className={`absolute top-8 flex w-full justify-center`}>
        <nav className={`z-10 flex w-3/4 justify-between px-8 py-2`}>
          <Logo />
          {/*<div>*/}
          {/*    <Button variant={"secondary"} className={`border border-black/65`}>Sign in</Button>*/}
          {/*</div>*/}
        </nav>
      </header>

      <div
        className={
          "flex flex-1 flex-col items-center justify-center gap-6 text-center"
        }
      >
        {/*<Badge className={`rounded-full bg-gray-300 text-base text-black px-4 py-1 font-light`}>*/}
        {/*    <Image src={"/doom.png"} alt={"logo"} width={250} height={250} className={"w-10"}/>*/}
        {/*    Inspired By MfDoom*/}
        {/*</Badge>*/}
        <h1 className={"text-5xl font-bold"}>
          Follow the lane. The lane is your guide.
        </h1>
        <p className={`max-w-xl text-lg text-black/65`}>
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
