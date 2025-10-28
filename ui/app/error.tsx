"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong.</h2>
      <p className="text-gray-500">{error.message}</p>
      <Button onClick={() => reset()} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
