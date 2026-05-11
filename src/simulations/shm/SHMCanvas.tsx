"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAnimationFrame } from "@/core/animation-runtime";
import { sampleOscillation } from "@/core/oscillation-engine";
import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import type { SimulationStatus } from "@/types/simulation";

import {
  SHM_VIEWBOX,
  createInitialSHMSnapshot,
  createSHMAnalytics,
  createSHMGraphSample,
  createSpringPath
} from "./physics";
import type { SHMAnalytics, SHMGraphSample, SHMParameters, SHMSnapshot } from "./types";

type SHMCanvasProps = {
  status: SimulationStatus;
  resetSignal: number;
  onAnalyticsChange: (analytics: SHMAnalytics) => void;
  onSamplesChange: (samples: SHMGraphSample[]) => void;
};

const SAMPLE_INTERVAL = 0.05;
const EQUILIBRIUM_X = 500;
const TRACK_Y = 300;
const SPRING_ANCHOR_X = 100;

export function SHMCanvas({
  status,
  resetSignal,
  onAnalyticsChange,
  onSamplesChange
}: SHMCanvasProps) {
  const { values } = useSimulationParameters();
  const parameters = values as SHMParameters;
  const { amplitude, frequency, damping, phase } = parameters;
  const [snapshot, setSnapshot] = useState<SHMSnapshot>(() => createInitialSHMSnapshot(parameters));
  const snapshotRef = useRef(snapshot);
  const samplesRef = useRef<SHMGraphSample[]>([]);
  const sampleCursorRef = useRef(0);
  const analyticsChangeRef = useRef(onAnalyticsChange);
  const samplesChangeRef = useRef(onSamplesChange);

  useEffect(() => {
    analyticsChangeRef.current = onAnalyticsChange;
  }, [onAnalyticsChange]);

  useEffect(() => {
    samplesChangeRef.current = onSamplesChange;
  }, [onSamplesChange]);

  const { reset: resetAnimationClock } = useAnimationFrame({
    isRunning: status === "running",
    onFrame: (_, elapsedTime) => {
      const nextSnapshot = sampleOscillation(parameters, elapsedTime);
      snapshotRef.current = nextSnapshot;
      setSnapshot(nextSnapshot);
      analyticsChangeRef.current(createSHMAnalytics(nextSnapshot, parameters));

      if (
        elapsedTime === 0 ||
        elapsedTime - sampleCursorRef.current >= SAMPLE_INTERVAL
      ) {
        const nextSamples = [...samplesRef.current, createSHMGraphSample(nextSnapshot)];
        samplesRef.current = nextSamples;
        sampleCursorRef.current = elapsedTime;
        samplesChangeRef.current(nextSamples);
      }
    }
  });

  useEffect(() => {
    const initialSnapshot = createInitialSHMSnapshot(parameters);
    const initialSample = createSHMGraphSample(initialSnapshot);

    resetAnimationClock();
    snapshotRef.current = initialSnapshot;
    samplesRef.current = [initialSample];
    sampleCursorRef.current = 0;
    setSnapshot(initialSnapshot);
    analyticsChangeRef.current(createSHMAnalytics(initialSnapshot, parameters));
    samplesChangeRef.current([initialSample]);
  }, [amplitude, damping, frequency, phase, parameters, resetAnimationClock, resetSignal]);

  const analytics = useMemo(() => createSHMAnalytics(snapshot, parameters), [parameters, snapshot]);
  const massCenterX = EQUILIBRIUM_X + snapshot.displacement;
  const springPoints = createSpringPath(SPRING_ANCHOR_X, massCenterX - 56, TRACK_Y);
  const envelopeHeight = Math.max(amplitude, 1);
  const phaseHandLength = 54;
  const phaseCx = 830;
  const phaseCy = 128;
  const phaseHandX = phaseCx + Math.cos(snapshot.phaseRadians) * phaseHandLength;
  const phaseHandY = phaseCy - Math.sin(snapshot.phaseRadians) * phaseHandLength;
  const velocityScale = 2.4;
  const velocityEndX = massCenterX + snapshot.velocity * velocityScale;

  return (
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${SHM_VIEWBOX.width} ${SHM_VIEWBOX.height}`}
      >
        <defs>
          <linearGradient id="springGlow" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <marker
            id="shmVelocityArrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#facc15" />
          </marker>
        </defs>

        <rect fill="#0f172a" height="560" rx="28" width="1000" x="0" y="0" />

        <line
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="10 10"
          strokeWidth="2"
          x1={EQUILIBRIUM_X}
          x2={EQUILIBRIUM_X}
          y1={140}
          y2={440}
        />
        <rect fill="rgba(255,255,255,0.1)" height="220" rx="20" width="22" x="72" y="190" />
        <line stroke="rgba(255,255,255,0.22)" strokeWidth="6" x1="100" x2="900" y1={TRACK_Y} y2={TRACK_Y} />

        <line
          stroke="rgba(45,212,191,0.2)"
          strokeDasharray="12 10"
          strokeWidth="2"
          x1={EQUILIBRIUM_X - amplitude}
          x2={EQUILIBRIUM_X - amplitude}
          y1={TRACK_Y - envelopeHeight}
          y2={TRACK_Y + envelopeHeight}
        />
        <line
          stroke="rgba(45,212,191,0.2)"
          strokeDasharray="12 10"
          strokeWidth="2"
          x1={EQUILIBRIUM_X + amplitude}
          x2={EQUILIBRIUM_X + amplitude}
          y1={TRACK_Y - envelopeHeight}
          y2={TRACK_Y + envelopeHeight}
        />

        <polyline
          fill="none"
          points={springPoints}
          stroke="url(#springGlow)"
          strokeLinejoin="round"
          strokeWidth="7"
        />

        <line
          markerEnd="url(#shmVelocityArrow)"
          stroke="#facc15"
          strokeWidth="4"
          x1={massCenterX}
          x2={velocityEndX}
          y1={TRACK_Y}
          y2={TRACK_Y}
        />

        <rect
          fill="#60a5fa"
          height="108"
          rx="24"
          stroke="#dbeafe"
          strokeWidth="4"
          width="112"
          x={massCenterX - 56}
          y={TRACK_Y - 54}
        />

        <circle cx={phaseCx} cy={phaseCy} fill="rgba(255,255,255,0.04)" r="70" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        <line stroke="#f472b6" strokeWidth="4" x1={phaseCx} x2={phaseHandX} y1={phaseCy} y2={phaseHandY} />
        <circle cx={phaseCx} cy={phaseCy} fill="#f8fafc" r="6" />

        <text fill="#f8fafc" fontSize="20" x="72" y="84">
          Simple Harmonic Motion
        </text>
        <text fill="#94a3b8" fontSize="16" x="72" y="112">
          Oscillating mass, spring extension, phase, and energy transfer
        </text>
        <text fill="#fde68a" fontSize="18" x={velocityEndX + 10} y={TRACK_Y - 12}>
          v = {analytics.velocity} px/s
        </text>
        <text fill="#f8fafc" fontSize="18" x={phaseCx - 46} y={phaseCy + 102}>
          phase {analytics.phaseDegrees} deg
        </text>
        <text fill="#5eead4" fontSize="18" x={EQUILIBRIUM_X - 76} y={TRACK_Y + 122}>
          x = {analytics.displacement} px
        </text>
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.25em] text-sky-200">
          {status === "running" ? "Running" : "Ready"}
        </div>
        <div className="mt-2 font-semibold">t = {analytics.time.toFixed(2)} s</div>
        <div className="mt-1 text-slate-300">
          x = {analytics.displacement.toFixed(2)}, E = {analytics.totalEnergy.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
