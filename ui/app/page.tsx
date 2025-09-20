'use client'
import Image from "next/image";
import Hyperspeed from "@/components/Hyperspeed";
import {Button} from "@/components/ui/button";
import {CheckCircleIcon, Pill, UserX} from "lucide-react";
import {PillStatus} from "@/components/ui/kibo-ui/pill";
import {Badge} from "@/components/ui/badge";
import Logo from "@/components/logo";

export default function Home() {
    return (
        <main className={`flex flex-col justify-between h-screen font-lato`}>
            <div className={`absolute w-screen h-screen overflow-hidden -z-10`}>
                <Hyperspeed
                    effectOptions={
                        {
                            onSpeedUp: () => {
                            },
                            onSlowDown: () => {
                            },
                            distortion: 'mountainDistortion',
                            length: 400,
                            roadWidth: 9,
                            islandWidth: 2,
                            lanesPerRoad: 3,
                            fov: 90,
                            fovSpeedUp: 150,
                            speedUp: 2,
                            carLightsFade: 0.4,
                            totalSideLightSticks: 50,
                            lightPairsPerRoadWay: 50,
                            shoulderLinesWidthPercentage: 0.05,
                            brokenLinesWidthPercentage: 0.1,
                            brokenLinesLengthPercentage: 0.5,
                            lightStickWidth: [0.12, 0.5],
                            lightStickHeight: [1.3, 1.7],

                            movingAwaySpeed: [60, 80],
                            movingCloserSpeed: [-120, -160],
                            carLightsLength: [400 * 0.05, 400 * 0.15],
                            carLightsRadius: [0.05, 0.14],
                            carWidthPercentage: [0.3, 0.5],
                            carShiftX: [-0.2, 0.2],
                            carFloorSeparation: [0.05, 1],
                            colors: {
                                roadColor: 0xFFFFFF,
                                islandColor: 0xFFFFFF,
                                background: 0xFFFFFF,
                                shoulderLines: 0x131318,
                                brokenLines: 0x131318,
                                leftCars: [0xff102a, 0xeb383e, 0xff102a],
                                rightCars: [0x000000, 0x000000, 0x000000],
                                sticks: 0x000000
                            }
                        }
                    }
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

            <div className={"flex-1 justify-center items-center flex flex-col gap-6 text-center"}>
                {/*<Badge className={`rounded-full bg-gray-300 text-base text-black px-4 py-1 font-light`}>*/}
                {/*    <Image src={"/doom.png"} alt={"logo"} width={250} height={250} className={"w-10"}/>*/}
                {/*    Inspired By MfDoom*/}
                {/*</Badge>*/}
                <h1 className={"text-5xl font-bold"}>Follow the lane. The lane is your guide.</h1>
                <p className={`text-lg max-w-xl text-black/65`}>
                    Peddle on the floor, thirsty for a score?
                    Fazerlane is the path. We turn endless YouTube tutorials into actionable challenges, so you can stop
                    just watching and start doing.
                    {/*Submit your progress in any form and master skills by getting your*/}
                    {/*hands dirty.*/}
                </p>
                <Button size={"xl"} className={``}>Get on the Lane</Button>
            </div>
        </main>
    );
}

