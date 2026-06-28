"use client";

import { useEffect, useRef } from "react";

export default function MouseSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move);

    let frame: number;

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x - 3}px, ${
          pos.current.y - 3
        }px, 0)`;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        ref={ref}
        className="absolute w-[60px] h-[60px] rounded-full blur-[10px]"
        style={{
          background: "rgba(249,115,22, 0.09)", // VERY subtle orange
        }}
      />
    </div>
  );
}