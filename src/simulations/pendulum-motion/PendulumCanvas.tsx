"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAnimationFrame } from "@/core/animation-runtime";
import { samplePendulum } from "@/core/oscillation-engine";
import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import type { SimulationStatus } from "@/types/simulation";

import {
  PENDULUM_VIEWBOX,
  createInitialPendulumSnapshot,
  createPendulumAnalytics,
  createPendulumGraphSample
} from "./physics";
import type {
  PendulumAnalytics,
  PendulumGraphSample,
  PendulumMotionSnapshot,
  PendulumParameters
} from "./types";

type PendulumCanvasProps = {
  status: SimulationStatus;
  resetSignal: number;
  onAnalyticsChange: (analytics: PendulumAnalytics) => void;
  onSamplesChange: (samples: PendulumGraphSample[]) => void;
};

const SAMPLE_INTERVAL = 0.05;
const PIVOT = { x: 500, y: 108 };
const PIXELS_PER_METER = 120;

export function PendulumCanvas({
  status,
  resetSignal,
  onAnalyticsChange,
  onSamplesChange
}: PendulumCanvasProps) {
  const { values } = useSimulationParameters();
  const parameters = values as PendulumParameters;
  const { length, gravity, damping, initialAngle } = parameters;
  const [snapshot, setSnapshot] = useState<PendulumMotionSnapshot>(() =>
    createInitialPendulumSnapshot(parameters)
  );
  const samplesRef = useRef<PendulumGraphSample[]>([]);
  const sampleCursorRef = useRef(0);
  const analyticsRef = useRef(onAnalyticsChange);
  const samplesChangeRef = useRef(onSamplesChange);

  useEffect(() => {
    analyticsRef.current = onAnalyticsChange;
  }, [onAnalyticsChange]);

  useEffect(() => {
    samplesChangeRef.current = onSamplesChange;
  }, [onSamplesChange]);

  const { reset: resetAnimationClock } = useAnimationFrame({
    isRunning: status === "running",
    onFrame: (_, elapsedTime) => {
      const nextSnapshot = samplePendulum(parameters, elapsedTime);
      setSnapshot(nextSnapshot);
      analyticsRef.current(createPendulumAnalytics(nextSnapshot, parameters));

      if (elapsedTime === 0 || elapsedTime - sampleCursorRef.current >= SAMPLE_INTERVAL) {
        const nextSamples = [...samplesRef.current, createPendulumGraphSample(nextSnapshot)];
        samplesRef.current = nextSamples;
        sampleCursorRef.current = elapsedTime;
        samplesChangeRef.current(nextSamples);
      }
    }
  });

  useEffect(() => {
    const initialSnapshot = createInitialPendulumSnapshot(parameters);
    const initialSample = createPendulumGraphSample(initialSnapshot);

    resetAnimationClock();
    samplesRef.current = [initialSample];
    sampleCursorRef.current = 0;
    setSnapshot(initialSnapshot);
    analyticsRef.current(createPendulumAnalytics(initialSnapshot, parameters));
    samplesChangeRef.current([initialSample]);
  }, [damping, gravity, initialAngle, length, parameters, resetAnimationClock, resetSignal]);

  const analytics = useMemo(
    () => createPendulumAnalytics(snapshot, parameters),
    [parameters, snapshot]
  );
  const rodLength = length * PIXELS_PER_METER;
  const bobX = PIVOT.x + rodLength * Math.sin(snapshot.angle);
  const bobY = PIVOT.y + rodLength * Math.cos(snapshot.angle);
  const velocityScale = 80;
  const tangentEndX = bobX + Math.cos(snapshot.angle) * snapshot.tangentialVelocity * velocityScale;
  const tangentEndY = bobY - Math.sin(snapshot.angle) * snapshot.tangentialVelocity * velocityScale;

  return (
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${PENDULUM_VIEWBOX.width} ${PENDULUM_VIEWBOX.height}`}
      >
        <defs>
          <radialGradient id="pendulumGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
          <marker
            id="pendulumVelocityArrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#facc15" />
          </marker>
        </defs>

        <rect fill="#0b1120" height="560" rx="28" width="1000" x="0" y="0" />
        <line
          stroke="rgba(255,255,255,0.14)"
          strokeDasharray="10 10"
          strokeWidth="2"
          x1={PIVOT.x}
          x2={PIVOT.x}
          y1={PIVOT.y}
          y2="470"
        />
        <rect fill="rgba(255,255,255,0.12)" height="22" rx="11" width="300" x="350" y="76" />
        <circle cx={PIVOT.x} cy={PIVOT.y} fill="#f8fafc" r="8" />
        <line stroke="#c4b5fd" strokeWidth="6" x1={PIVOT.x} x2={bobX} y1={PIVOT.y} y2={bobY} />

        <line
          markerEnd="url(#pendulumVelocityArrow)"
          stroke="#facc15"
          strokeWidth="4"
          x1={bobX}
          x2={tangentEndX}
          y1={bobY}
          y2={tangentEndY}
        />

        <circle cx={bobX} cy={bobY} fill="url(#pendulumGlow)" r="34" />
        <circle cx={bobX} cy={bobY} fill="rgba(255,255,255,0.18)" r="48" />

        <path
          d={`M ${PIVOT.x - 82} ${PIVOT.y + 38} A 82 82 0 0 1 ${PIVOT.x + 82} ${PIVOT.y + 38}`}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2"
        />

        <text fill="#f8fafc" fontSize="20" x="72" y="84">
          Pendulum Motion
        </text>
        <text fill="#94a3b8" fontSize="16" x="72" y="112">
          Gravity, length, damping, angular displacement, and energy exchange
        </text>
        <text fill="#f8fafc" fontSize="18" x="690" y="112">
          angle {analytics.angleDegrees} deg
        </text>
        <text fill="#fde68a" fontSize="18" x={tangentEndX + 8} y={tangentEndY - 10}>
          vt = {analytics.tangentialVelocity}
        </text>
        <text fill="#5eead4" fontSize="18" x="72" y="500">
          T = {analytics.period} s
        </text>
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.25em] text-sky-200">
          {status === "running" ? "Running" : "Ready"}
        </div>
        <div className="mt-2 font-semibold">t = {analytics.time.toFixed(2)} s</div>
        <div className="mt-1 text-slate-300">
          theta = {analytics.angleDegrees.toFixed(2)} deg, E = {analytics.totalEnergy.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
