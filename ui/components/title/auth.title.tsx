import Image from "next/image";

export default function AuthTitle({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image src={"/brand/favicon.svg"} alt="logo" width={48} height={48} />
      <h1 className="text-center text-2xl font-semibold tracking-tighter">
        {title}
      </h1>
    </div>
  );
}
