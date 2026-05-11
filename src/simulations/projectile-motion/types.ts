import type { GraphPoint } from "@/types/simulation";
import type { MotionState } from "@/core/physics-engine";
import type { Vector2 } from "@/core/vector-engine";

export type ProjectileMotionParameters = {
  launchAngle: number;
  launchVelocity: number;
  gravity: number;
};

export type ProjectileGraphSample = GraphPoint & {
  x: number;
  y: number;
  speed: number;
};

export type ProjectileAnalytics = {
  currentTime: number;
  currentX: number;
  currentY: number;
  speed: number;
  maxHeight: number;
  range: number;
  flightTime: number;
  timeToPeak: number;
  peakPoint: Vector2;
  hasLanded: boolean;
};

export type ProjectileRuntimeSnapshot = MotionState & {
  trail: Vector2[];
};
