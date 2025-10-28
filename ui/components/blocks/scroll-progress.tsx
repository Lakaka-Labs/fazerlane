"use client";

import { motion, useScroll } from "motion/react";
import { RefObject, useEffect, useState } from "react";

interface ScrollProgressProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, [containerRef]);

  if (!isReady) return null;

  return (
    <motion.div
      className="from-brand-red-50 to-brand-red fixed top-[70px] right-0 bottom-0 left-0 z-20 h-1 origin-left bg-gradient-to-r"
      style={{ scaleX: scrollYProgress }}
      initial={{ scaleX: 0 }}
    />
  );
}
