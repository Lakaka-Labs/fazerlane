"use client";

import { Fragment, useEffect } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      const _locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return <Fragment>{children}</Fragment>;
}
