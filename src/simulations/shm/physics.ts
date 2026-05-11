import {
  estimateOscillationWindow,
  sampleOscillation,
  type OscillationSnapshot
} from "@/core/oscillation-engine";
import { radiansToDegrees, roundTo } from "@/core/math-engine";

import type { SHMAnalytics, SHMGraphSample, SHMParameters } from "./types";

export const SHM_VIEWBOX = {
  width: 1000,
  height: 560
};

export function createInitialSHMSnapshot(parameters: SHMParameters) {
  return sampleOscillation(parameters, 0);
}

export function createSHMAnalytics(
  snapshot: OscillationSnapshot,
  parameters: SHMParameters
): SHMAnalytics {
  const timing = estimateOscillationWindow(parameters);

  return {
    time: roundTo(snapshot.time, 2),
    displacement: roundTo(snapshot.displacement, 2),
    velocity: roundTo(snapshot.velocity, 2),
    acceleration: roundTo(snapshot.acceleration, 2),
    kineticEnergy: roundTo(snapshot.kineticEnergy, 2),
    potentialEnergy: roundTo(snapshot.potentialEnergy, 2),
    totalEnergy: roundTo(snapshot.totalEnergy, 2),
    period: roundTo(timing.period, 2),
    phaseDegrees: roundTo(((radiansToDegrees(snapshot.phaseRadians) % 360) + 360) % 360, 1)
  };
}

export function createSHMGraphSample(snapshot: OscillationSnapshot): SHMGraphSample {
  return {
    timestamp: roundTo(snapshot.time, 2),
    displacement: roundTo(snapshot.displacement, 2),
    kineticEnergy: roundTo(snapshot.kineticEnergy, 2),
    potentialEnergy: roundTo(snapshot.potentialEnergy, 2),
    totalEnergy: roundTo(snapshot.totalEnergy, 2)
  };
}

export function createSpringPath(
  anchorX: number,
  centerX: number,
  baselineY: number,
  coils = 10
) {
  const amplitude = 18;
  const totalLength = centerX - anchorX;
  const leftPadding = 50;
  const rightPadding = 40;
  const innerLength = Math.max(totalLength - leftPadding - rightPadding, 80);
  const startX = anchorX + leftPadding;
  const endX = startX + innerLength;
  const segmentLength = innerLength / (coils * 2);
  const points = [`${anchorX},${baselineY}`, `${startX},${baselineY}`];

  for (let index = 0; index < coils * 2; index += 1) {
    const x = startX + segmentLength * (index + 1);
    const y = baselineY + (index % 2 === 0 ? -amplitude : amplitude);
    points.push(`${x},${y}`);
  }

  points.push(`${endX + rightPadding},${baselineY}`);
  return points.join(" ");
}
