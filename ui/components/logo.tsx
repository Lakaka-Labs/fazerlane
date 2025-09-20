import Image from "next/image";

export default function Logo() {
    return (
        <div className={`flex items-center gap-2`}>
            <Image src={"/logo.svg"} alt={"logo"} width={250} height={250} className={"w-12"}/>
            <h1 className={`text-3xl font-julius`}>Fazerlane</h1>
        </div>
    )
}