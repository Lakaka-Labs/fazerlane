import { usePersistStore } from "@/store/persist.store";
import Image from "next/image";

export default function AskAIButton() {
  const { setShowChatbot } = usePersistStore((store) => store);

  return (
    <button
      onClick={() => setShowChatbot(true)}
      className="animate-gradient h-fit w-fit rounded-[50px] bg-gradient-to-r from-[#3AE7CA] via-[#357FEE] to-[#EE0672] bg-[length:200%_200%] p-0.5"
    >
      <span className="bg-brand-deep-black flex h-10 w-fit items-center gap-2 rounded-[50px] px-7 text-base font-bold text-white">
        ASK AI
        <Image
          src={"/icons/ai-sparkle.svg"}
          alt="
          ai sparkle"
          width={16}
          height={16}
        />
      </span>
    </button>
  );
}
