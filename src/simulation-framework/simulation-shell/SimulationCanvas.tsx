"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { SimulationCanvasBinding } from "@/types/simulation";

type SimulationCanvasProps = {
  title?: string;
  overlay?: ReactNode;
  onCanvasReady?: (binding: SimulationCanvasBinding) => void;
};

export function SimulationCanvas({
  title = "Simulation Canvas",
  overlay,
  onCanvasReady
}: SimulationCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const updateSize = () => {
      const nextDimensions = {
        width: node.clientWidth,
        height: node.clientHeight
      };

      setDimensions(nextDimensions);
      onCanvasReady?.({
        mountNode: node,
        ...nextDimensions
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [onCanvasReady]);

  return (
    <section className="rounded-3xl border border-white/60 bg-slate-950 p-4 text-white shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
          {isHydrated ? `${dimensions.width} x ${dimensions.height}` : "Canvas Ready"}
        </span>
      </div>
      <div
        className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(43,143,255,0.24),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,0.86),_rgba(2,6,23,1))]"
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0">{overlay}</div>
      </div>
    </section>
  );
}
