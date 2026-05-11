"use client";

import { useEffect, useMemo, useState } from "react";

import { useSimulationParameters } from "@/simulation-framework/parameter-system";

import {
  ELECTRIC_VIEWBOX,
  createElectricFieldSnapshot,
  createFieldLines,
  getPresetCharges
} from "./physics";
import type { ElectricCharge, ElectricFieldParameters } from "./types";

function ChargeNode({
  charge,
  onDrag
}: {
  charge: ElectricCharge;
  onDrag: (id: string, x: number, y: number) => void;
}) {
  return (
    <g
      className="cursor-grab"
      onPointerDown={(event) => {
        const svg = (event.currentTarget.ownerSVGElement as SVGSVGElement | null);

        if (!svg) {
          return;
        }

        const handleMove = (moveEvent: PointerEvent) => {
          const rect = svg.getBoundingClientRect();
          const viewboxX = ((moveEvent.clientX - rect.left) / rect.width) * ELECTRIC_VIEWBOX.width;
          const viewboxY = ((moveEvent.clientY - rect.top) / rect.height) * ELECTRIC_VIEWBOX.height;
          onDrag(id, viewboxX, viewboxY);
        };

        const handleUp = () => {
          window.removeEventListener("pointermove", handleMove);
          window.removeEventListener("pointerup", handleUp);
        };

        const id = charge.id;
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
      }}
    >
      <circle
        cx={charge.x}
        cy={charge.y}
        fill={charge.magnitude >= 0 ? "#f97316" : "#38bdf8"}
        r="28"
        stroke="#f8fafc"
        strokeWidth="4"
      />
      <text
        fill="#ffffff"
        fontSize="28"
        fontWeight="700"
        textAnchor="middle"
        x={charge.x}
        y={charge.y + 10}
      >
        {charge.magnitude >= 0 ? "+" : "-"}
      </text>
    </g>
  );
}

export function ElectricFieldCanvas() {
  const { values } = useSimulationParameters();
  const parameters = values as ElectricFieldParameters;
  const [charges, setCharges] = useState<ElectricCharge[]>(() =>
    getPresetCharges(parameters.selectedPreset)
  );

  useEffect(() => {
    setCharges(getPresetCharges(parameters.selectedPreset));
  }, [parameters.selectedPreset]);

  const snapshot = useMemo(() => createElectricFieldSnapshot(charges), [charges]);
  const fieldLines = useMemo(() => createFieldLines(charges), [charges]);

  return (
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${ELECTRIC_VIEWBOX.width} ${ELECTRIC_VIEWBOX.height}`}
      >
        <rect fill="#07111f" height="560" rx="28" width="1000" />

        <text fill="#f8fafc" fontSize="20" x="72" y="84">
          Electric Field Visualization
        </text>
        <text fill="#94a3b8" fontSize="16" x="72" y="112">
          Drag charges to explore vector fields, electric potential, and field-line structure
        </text>

        {parameters.showFieldLines
          ? fieldLines.map((line) => (
              <polyline
                key={line.id}
                fill="none"
                points={line.points.map((point) => `${point.x},${point.y}`).join(" ")}
                stroke="rgba(250,204,21,0.55)"
                strokeWidth="2"
              />
            ))
          : null}

        {parameters.showVectors
          ? snapshot.grid.map((sample, index) => {
              const length = Math.min(sample.strength * 180000, 26);
              const angle = Math.atan2(sample.field.y, sample.field.x);
              const x2 = sample.position.x + Math.cos(angle) * length;
              const y2 = sample.position.y + Math.sin(angle) * length;

              return (
                <g key={index}>
                  <line
                    stroke="rgba(56,189,248,0.75)"
                    strokeWidth="2.5"
                    x1={sample.position.x}
                    x2={x2}
                    y1={sample.position.y}
                    y2={y2}
                  />
                  <circle cx={sample.position.x} cy={sample.position.y} fill="rgba(255,255,255,0.25)" r="2" />
                </g>
              );
            })
          : null}

        {charges.map((charge) => (
          <ChargeNode
            charge={charge}
            key={charge.id}
            onDrag={(id, x, y) => {
              setCharges((current) =>
                current.map((item) =>
                  item.id === id
                    ? { ...item, x: Math.max(80, Math.min(x, 920)), y: Math.max(110, Math.min(y, 450)) }
                    : item
                )
              );
            }}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Electricity</div>
        <div className="mt-2 font-semibold">{charges.length} active charges</div>
        <div className="mt-1 text-slate-300">Drag charges to reshape the field in real time</div>
      </div>
    </div>
  );
}
