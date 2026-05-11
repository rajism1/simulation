import type { GraphPoint } from "@/types/simulation";
import type { PendulumSnapshot } from "@/core/oscillation-engine";

export type PendulumParameters = {
  length: number;
  gravity: number;
  damping: number;
  initialAngle: number;
};

export type PendulumGraphSample = GraphPoint & {
  angleDegrees: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
};

export type PendulumAnalytics = {
  time: number;
  angleDegrees: number;
  angularVelocity: number;
  angularAcceleration: number;
  tangentialVelocity: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  period: number;
};

export type PendulumMotionSnapshot = PendulumSnapshot;
