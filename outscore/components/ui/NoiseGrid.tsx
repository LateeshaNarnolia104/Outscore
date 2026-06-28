"use client";

export default function NoiseGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-soft-light">
      <div className="absolute inset-0 noise" />
      <div className="absolute inset-0 grid-overlay" />
    </div>
  );
}