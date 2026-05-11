"use client";

import { useMemo } from "react";

import { useSimulationParameters } from "@/simulation-framework/parameter-system";

import {
  LENS_VIEWBOX,
  OBJECT_HEIGHT,
  createLensScene
} from "./physics";
import type { ConvexLensSimulationParameters } from "./types";

const ORIGIN_X = 500;
const AXIS_Y = 290;
const UNIT_SCALE = 8.5;

type CanvasPoint = {
  x: number;
  y: number;
};

function toCanvasPoint(point: { x: number; y: number }): CanvasPoint {
  return {
    x: ORIGIN_X + point.x * UNIT_SCALE,
    y: AXIS_Y - point.y
  };
}

function Arrow({
  x,
  baseY,
  height,
  color,
  label
}: {
  x: number;
  baseY: number;
  height: number;
  color: string;
  label: string;
}) {
  const tipY = baseY - height;

  return (
    <>
      <line stroke={color} strokeWidth="5" x1={x} x2={x} y1={baseY} y2={tipY} />
      <path
        d={`M ${x - 12} ${tipY + 18} L ${x} ${tipY} L ${x + 12} ${tipY + 18}`}
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
      <text fill={color} fontSize="18" x={x - 20} y={tipY - 12}>
        {label}
      </text>
    </>
  );
}

export function ConvexLensCanvas() {
  const { values } = useSimulationParameters();
  const parameters = values as ConvexLensSimulationParameters;

  const scene = useMemo(() => createLensScene(parameters), [parameters]);
  const objectBase = toCanvasPoint({ x: -parameters.objectDistance, y: 0 });
  const imageXFinite = Number.isFinite(scene.image.imageDistance)
    ? scene.image.imageDistance
    : parameters.focalLength * 2.8;
  const imageHeightFinite = Number.isFinite(scene.image.imageHeight)
    ? scene.image.imageHeight
    : -OBJECT_HEIGHT * 0.7;
  const imageBase = toCanvasPoint({ x: imageXFinite, y: 0 });

  return (
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${LENS_VIEWBOX.width} ${LENS_VIEWBOX.height}`}
      >
        <defs>
          <linearGradient id="lensFill" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.28)" />
            <stop offset="50%" stopColor="rgba(125,211,252,0.52)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.28)" />
          </linearGradient>
        </defs>

        <rect fill="#07111f" height="560" rx="28" width="1000" />
        <line stroke="rgba(255,255,255,0.18)" strokeWidth="3" x1="60" x2="940" y1={AXIS_Y} y2={AXIS_Y} />

        <path
          d={`M ${ORIGIN_X} 120 C ${ORIGIN_X - 28} 168, ${ORIGIN_X - 28} 412, ${ORIGIN_X} 460 C ${ORIGIN_X + 28} 412, ${ORIGIN_X + 28} 168, ${ORIGIN_X} 120 Z`}
          fill="url(#lensFill)"
          stroke="#93c5fd"
          strokeWidth="4"
        />

        <line stroke="rgba(255,255,255,0.22)" strokeDasharray="10 10" strokeWidth="2" x1={ORIGIN_X} x2={ORIGIN_X} y1="80" y2="500" />

        {[-parameters.focalLength, parameters.focalLength].map((focus, index) => {
          const x = ORIGIN_X + focus * UNIT_SCALE;

          return (
            <g key={focus}>
              <line stroke="rgba(148,163,184,0.32)" strokeWidth="2" x1={x} x2={x} y1={AXIS_Y - 16} y2={AXIS_Y + 16} />
              <text fill="#cbd5e1" fontSize="16" x={x - 8} y={AXIS_Y + 42}>
                {index === 0 ? "F" : "F'"}
              </text>
            </g>
          );
        })}

        <Arrow
          baseY={objectBase.y}
          color="#38bdf8"
          height={OBJECT_HEIGHT}
          label="O"
          x={objectBase.x}
        />

        {!scene.image.atFocus ? (
          <Arrow
            baseY={imageBase.y}
            color={scene.image.imageNature === "real" ? "#f97316" : "#22c55e"}
            height={imageHeightFinite}
            label="I"
            x={imageBase.x}
          />
        ) : null}

        {Object.values(scene.rays).flat().map((segment, index) => {
          const from = toCanvasPoint(segment.from);
          const to = toCanvasPoint(segment.to);

          return (
            <line
              key={`${index}-${segment.from.x}-${segment.to.x}`}
              stroke={segment.dashed ? "rgba(74,222,128,0.56)" : "#fcd34d"}
              strokeDasharray={segment.dashed ? "8 8" : undefined}
              strokeWidth={segment.dashed ? "2.5" : "3.5"}
              x1={from.x}
              x2={to.x}
              y1={from.y}
              y2={to.y}
            />
          );
        })}

        <text fill="#f8fafc" fontSize="20" x="72" y="84">
          Convex Lens Ray Tracing
        </text>
        <text fill="#94a3b8" fontSize="16" x="72" y="112">
          Principal axis, focus points, and real or virtual image formation
        </text>
        <text fill="#f8fafc" fontSize="18" x="72" y="496">
          Nature: {scene.image.atFocus ? "image at infinity" : scene.image.imageNature}
        </text>
        <text fill="#f8fafc" fontSize="18" x="72" y="524">
          Orientation: {scene.image.orientation}
        </text>
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Optics</div>
        <div className="mt-2 font-semibold">
          f = {parameters.focalLength.toFixed(0)} cm, u = {parameters.objectDistance.toFixed(0)} cm
        </div>
        <div className="mt-1 text-slate-300">
          v = {scene.image.atFocus ? "Infinity" : `${scene.image.imageDistance} cm`}
        </div>
      </div>
    </div>
  );
}
