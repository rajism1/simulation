"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAnimationFrame } from "@/core/animation-runtime";
import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import type { SimulationStatus } from "@/types/simulation";

import {
  CANVAS_VIEWBOX,
  createIdealTrajectory,
  createInitialMotionState,
  createProjectileGraphSample,
  createWorldTransform,
  deriveProjectileAnalytics,
  projectMotionState,
  resolveGroundImpact
} from "./physics";
import type {
  ProjectileAnalytics,
  ProjectileGraphSample,
  ProjectileMotionParameters,
  ProjectileRuntimeSnapshot
} from "./types";

type ProjectileMotionCanvasProps = {
  status: SimulationStatus;
  resetSignal: number;
  onAnalyticsChange: (analytics: ProjectileAnalytics) => void;
  onSamplesChange: (samples: ProjectileGraphSample[]) => void;
  onAutoPause: () => void;
};

const GRAPH_SAMPLE_INTERVAL = 0.05;

export function ProjectileMotionCanvas({
  status,
  resetSignal,
  onAnalyticsChange,
  onSamplesChange,
  onAutoPause
}: ProjectileMotionCanvasProps) {
  const { values } = useSimulationParameters();
  const parameters = values as ProjectileMotionParameters;
  const { launchAngle, launchVelocity, gravity } = parameters;
  const [snapshot, setSnapshot] = useState<ProjectileRuntimeSnapshot>(() =>
    createInitialMotionState(parameters)
  );
  const snapshotRef = useRef(snapshot);
  const graphSamplesRef = useRef<ProjectileGraphSample[]>([]);
  const sampleCursorRef = useRef(0);
  const landedRef = useRef(false);
  const analyticsChangeRef = useRef(onAnalyticsChange);
  const samplesChangeRef = useRef(onSamplesChange);
  const autoPauseRef = useRef(onAutoPause);

  useEffect(() => {
    analyticsChangeRef.current = onAnalyticsChange;
  }, [onAnalyticsChange]);

  useEffect(() => {
    samplesChangeRef.current = onSamplesChange;
  }, [onSamplesChange]);

  useEffect(() => {
    autoPauseRef.current = onAutoPause;
  }, [onAutoPause]);

  const { reset: resetAnimationClock } = useAnimationFrame({
    isRunning: status === "running",
    onFrame: (deltaTime, elapsedTime) => {
      if (landedRef.current) {
        return;
      }

      const previousSnapshot = snapshotRef.current;
      let nextSnapshot = projectMotionState(previousSnapshot, deltaTime);
      let landed = false;
      let simulationTime = elapsedTime;

      if (nextSnapshot.position.y <= 0 && elapsedTime > 0.01) {
        const impact = resolveGroundImpact(previousSnapshot, nextSnapshot, deltaTime);
        nextSnapshot = impact.snapshot;
        simulationTime = elapsedTime - deltaTime + deltaTime * impact.impactRatio;
        landed = true;
        landedRef.current = true;
      }

      snapshotRef.current = nextSnapshot;
      setSnapshot(nextSnapshot);

      const analytics = deriveProjectileAnalytics(
        parameters,
        nextSnapshot,
        simulationTime,
        landed
      );
      analyticsChangeRef.current(analytics);

      if (
        landed ||
        simulationTime === 0 ||
        simulationTime - sampleCursorRef.current >= GRAPH_SAMPLE_INTERVAL
      ) {
        const nextSamples = [
          ...graphSamplesRef.current,
          createProjectileGraphSample(simulationTime, nextSnapshot)
        ];

        graphSamplesRef.current = nextSamples;
        sampleCursorRef.current = simulationTime;
        samplesChangeRef.current(nextSamples);
      }

      if (landed) {
        autoPauseRef.current();
      }
    }
  });

  useEffect(() => {
    const initialSnapshot = createInitialMotionState(parameters);
    const initialAnalytics = deriveProjectileAnalytics(parameters, initialSnapshot, 0, false);
    const initialSample = createProjectileGraphSample(0, initialSnapshot);

    resetAnimationClock();
    landedRef.current = false;
    sampleCursorRef.current = 0;
    graphSamplesRef.current = [initialSample];
    snapshotRef.current = initialSnapshot;
    setSnapshot(initialSnapshot);
    analyticsChangeRef.current(initialAnalytics);
    samplesChangeRef.current([initialSample]);
  }, [gravity, launchAngle, launchVelocity, parameters, resetAnimationClock, resetSignal]);

  const analytics = useMemo(
    () =>
      deriveProjectileAnalytics(
        parameters,
        snapshot,
        graphSamplesRef.current.at(-1)?.timestamp ?? 0,
        landedRef.current
      ),
    [parameters, snapshot]
  );
  const idealTrajectory = useMemo(() => createIdealTrajectory(parameters), [parameters]);
  const transform = useMemo(() => createWorldTransform(analytics, snapshot), [analytics, snapshot]);

  const actualPath = snapshot.trail
    .map((point) => {
      const svgPoint = transform.toSvg(point);
      return `${svgPoint.x},${svgPoint.y}`;
    })
    .join(" ");

  const idealPath = idealTrajectory
    .map((point) => {
      const svgPoint = transform.toSvg(point);
      return `${svgPoint.x},${svgPoint.y}`;
    })
    .join(" ");

  const projectilePoint = transform.toSvg(snapshot.position);
  const peakPoint = transform.toSvg(analytics.peakPoint);
  const groundEnd = transform.toSvg({ x: analytics.range, y: 0 });
  const groundStart = transform.toSvg({ x: 0, y: 0 });
  const velocityScale = 6;
  const velocityEnd = transform.toSvg({
    x: snapshot.position.x + snapshot.velocity.x / velocityScale,
    y: Math.max(snapshot.position.y + snapshot.velocity.y / velocityScale, 0)
  });

  return (
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${CANVAS_VIEWBOX.width} ${CANVAS_VIEWBOX.height}`}
      >
        <defs>
          <linearGradient id="trajectoryStroke" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <marker
            id="velocityArrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#facc15" />
          </marker>
        </defs>

        <line
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          x1={groundStart.x}
          x2={CANVAS_VIEWBOX.width - CANVAS_VIEWBOX.paddingX / 2}
          y1={groundStart.y}
          y2={groundStart.y}
        />

        <line
          stroke="rgba(248,250,252,0.24)"
          strokeDasharray="8 8"
          strokeWidth="1.5"
          x1={peakPoint.x}
          x2={peakPoint.x}
          y1={peakPoint.y}
          y2={groundStart.y}
        />
        <line
          stroke="rgba(248,250,252,0.24)"
          strokeDasharray="8 8"
          strokeWidth="1.5"
          x1={groundStart.x}
          x2={peakPoint.x}
          y1={peakPoint.y}
          y2={peakPoint.y}
        />

        <line
          stroke="#fb7185"
          strokeDasharray="12 10"
          strokeWidth="2"
          x1={groundStart.x}
          x2={groundEnd.x}
          y1={groundStart.y}
          y2={groundEnd.y}
        />

        <polyline
          fill="none"
          points={idealPath}
          stroke="rgba(255,255,255,0.28)"
          strokeDasharray="10 10"
          strokeWidth="3"
        />
        <polyline
          fill="none"
          points={actualPath}
          stroke="url(#trajectoryStroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        <line
          markerEnd="url(#velocityArrow)"
          stroke="#facc15"
          strokeWidth="3"
          x1={projectilePoint.x}
          x2={velocityEnd.x}
          y1={projectilePoint.y}
          y2={velocityEnd.y}
        />

        <circle cx={peakPoint.x} cy={peakPoint.y} fill="#f97316" r="7" />
        <circle cx={projectilePoint.x} cy={projectilePoint.y} fill="#38bdf8" r="12" />
        <circle cx={projectilePoint.x} cy={projectilePoint.y} fill="#e0f2fe" opacity="0.55" r="22" />

        <text
          fill="#f8fafc"
          fontSize="18"
          x={peakPoint.x + 12}
          y={peakPoint.y - 14}
        >
          Max height: {analytics.maxHeight} m
        </text>
        <text
          fill="#fda4af"
          fontSize="18"
          textAnchor="end"
          x={groundEnd.x}
          y={groundEnd.y - 14}
        >
          Range: {analytics.range} m
        </text>
        <text
          fill="#fde68a"
          fontSize="18"
          x={velocityEnd.x + 10}
          y={velocityEnd.y - 10}
        >
          v = {analytics.speed} m/s
        </text>
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.25em] text-sky-200">
          {status === "running" ? "Running" : analytics.hasLanded ? "Complete" : "Ready"}
        </div>
        <div className="mt-2 font-semibold">
          t = {analytics.currentTime.toFixed(2)} s
        </div>
        <div className="mt-1 text-slate-300">
          x = {analytics.currentX.toFixed(2)} m, y = {analytics.currentY.toFixed(2)} m
        </div>
      </div>
    </div>
  );
}
