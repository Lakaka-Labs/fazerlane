import { LoaderCircle } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="text-primary flex h-screen w-full animate-pulse items-center justify-center">
      <LoaderCircle size={48} className="animate-spin" />
    </div>
  );
}
