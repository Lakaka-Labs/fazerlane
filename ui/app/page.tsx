import { GuestOnlyGuard } from "@/components/guard";
import HeroHome from "@/views/home/hero";

export default function Home() {
  return (
    <GuestOnlyGuard>
      <HeroHome />
    </GuestOnlyGuard>
  );
}
