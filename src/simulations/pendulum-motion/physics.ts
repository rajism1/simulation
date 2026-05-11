import {
  estimatePendulumWindow,
  samplePendulum,
  type PendulumSnapshot as CorePendulumSnapshot
} from "@/core/oscillation-engine";
import { radiansToDegrees, roundTo } from "@/core/math-engine";

import type {
  PendulumAnalytics,
  PendulumGraphSample,
  PendulumMotionSnapshot,
  PendulumParameters
} from "./types";

export const PENDULUM_VIEWBOX = {
  width: 1000,
  height: 560
};

export function createInitialPendulumSnapshot(parameters: PendulumParameters): PendulumMotionSnapshot {
  return samplePendulum(parameters, 0);
}

export function createPendulumAnalytics(
  snapshot: CorePendulumSnapshot,
  parameters: PendulumParameters
): PendulumAnalytics {
  const timing = estimatePendulumWindow(parameters);

  return {
    time: roundTo(snapshot.time, 2),
    angleDegrees: roundTo(radiansToDegrees(snapshot.angle), 2),
    angularVelocity: roundTo(snapshot.angularVelocity, 3),
    angularAcceleration: roundTo(snapshot.angularAcceleration, 3),
    tangentialVelocity: roundTo(snapshot.tangentialVelocity, 2),
    kineticEnergy: roundTo(snapshot.kineticEnergy, 2),
    potentialEnergy: roundTo(snapshot.potentialEnergy, 2),
    totalEnergy: roundTo(snapshot.totalEnergy, 2),
    period: roundTo(timing.period, 2)
  };
}

export function createPendulumGraphSample(snapshot: CorePendulumSnapshot): PendulumGraphSample {
  return {
    timestamp: roundTo(snapshot.time, 2),
    angleDegrees: roundTo(radiansToDegrees(snapshot.angle), 2),
    kineticEnergy: roundTo(snapshot.kineticEnergy, 2),
    potentialEnergy: roundTo(snapshot.potentialEnergy, 2),
    totalEnergy: roundTo(snapshot.totalEnergy, 2)
  };
}
