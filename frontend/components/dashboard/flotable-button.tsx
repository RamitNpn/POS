"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Props = {
  targetId: string;
};

export default function ScrollToggleButton({ targetId }: Props) {
  const searchParams = useSearchParams();

  const tableId = searchParams.get("tableId");

  const [isAtTarget, setIsAtTarget] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtTarget(entry.isIntersecting);
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId]);

  if (!tableId) return null;

  const scrollToTarget = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={isAtTarget ? scrollToTop : scrollToTarget}
      className="
        fixed
        bottom-6
        right-6
        z-50
        h-12
        w-12
        rounded-full
        bg-primary
        text-primary-foreground
        shadow-lg
        flex
        items-center
        justify-center
        hover:opacity-90
      "
    >
      {isAtTarget ? (
        <ArrowUp className="h-5 w-5" />
      ) : (
        <ArrowDown className="h-5 w-5" />
      )}
    </button>
  );
}
