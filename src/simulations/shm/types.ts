import type { GraphPoint } from "@/types/simulation";
import type { OscillationSnapshot } from "@/core/oscillation-engine";

export type SHMParameters = {
  amplitude: number;
  frequency: number;
  damping: number;
  phase: number;
};

export type SHMGraphSample = GraphPoint & {
  displacement: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
};

export type SHMAnalytics = {
  time: number;
  displacement: number;
  velocity: number;
  acceleration: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  period: number;
  phaseDegrees: number;
};

export type SHMSnapshot = OscillationSnapshot;
