"use client";

import { usePersistStore } from "@/store/persist.store";

export default function DUserHome() {
  const { token } = usePersistStore((state) => state);
  return <div>User Dashboard Home {token.jwt}</div>;
}
