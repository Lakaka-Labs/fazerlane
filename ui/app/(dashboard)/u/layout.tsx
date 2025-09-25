import { Chatbot } from "@/components/chatbot";
import { PropsWithChildren } from "react";

export default function DUserLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Chatbot />
      <div>{children}</div>
    </div>
  );
}
