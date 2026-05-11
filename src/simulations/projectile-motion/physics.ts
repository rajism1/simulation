import {
  calculateVelocity,
  integrateMotion,
  type MotionState
} from "@/core/physics-engine";
import { degreesToRadians, roundTo } from "@/core/math-engine";
import { magnitude, type Vector2 } from "@/core/vector-engine";

import type {
  ProjectileAnalytics,
  ProjectileGraphSample,
  ProjectileMotionParameters,
  ProjectileRuntimeSnapshot
} from "./types";

export const CANVAS_VIEWBOX = {
  width: 1000,
  height: 560,
  paddingX: 56,
  paddingTop: 48,
  paddingBottom: 56
};

export function createInitialMotionState(
  parameters: ProjectileMotionParameters
): ProjectileRuntimeSnapshot {
  const angle = degreesToRadians(parameters.launchAngle);
  const velocity = {
    x: parameters.launchVelocity * Math.cos(angle),
    y: parameters.launchVelocity * Math.sin(angle)
  };

  return {
    position: { x: 0, y: 0 },
    velocity,
    acceleration: { x: 0, y: -parameters.gravity },
    trail: [{ x: 0, y: 0 }]
  };
}

export function projectMotionState(
  snapshot: ProjectileRuntimeSnapshot,
  deltaTime: number
): ProjectileRuntimeSnapshot {
  const next = integrateMotion(snapshot, deltaTime);

  return {
    ...next,
    trail: [...snapshot.trail, next.position]
  };
}

export function resolveGroundImpact(
  previous: ProjectileRuntimeSnapshot,
  next: ProjectileRuntimeSnapshot,
  deltaTime: number
) {
  if (next.position.y >= 0) {
    return {
      snapshot: next,
      impactRatio: 1
    };
  }

  const totalDrop = previous.position.y - next.position.y;
  const interpolation = totalDrop === 0 ? 1 : previous.position.y / totalDrop;
  const impactX = previous.position.x + (next.position.x - previous.position.x) * interpolation;
  const impactVelocity = calculateVelocity(
    previous.velocity,
    previous.acceleration,
    deltaTime * interpolation
  );

  return {
    snapshot: {
      ...next,
      position: {
        x: impactX,
        y: 0
      },
      velocity: impactVelocity,
      trail: [...previous.trail, { x: impactX, y: 0 }]
    },
    impactRatio: interpolation
  };
}

export function deriveProjectileAnalytics(
  parameters: ProjectileMotionParameters,
  snapshot: MotionState,
  currentTime: number,
  hasLanded: boolean
): ProjectileAnalytics {
  const angle = degreesToRadians(parameters.launchAngle);
  const initialVelocityX = parameters.launchVelocity * Math.cos(angle);
  const initialVelocityY = parameters.launchVelocity * Math.sin(angle);
  const safeGravity = Math.max(parameters.gravity, 0.0001);
  const timeToPeak = initialVelocityY / safeGravity;
  const maxHeight = (initialVelocityY * initialVelocityY) / (2 * safeGravity);
  const flightTime = (2 * initialVelocityY) / safeGravity;
  const range = initialVelocityX * flightTime;

  return {
    currentTime: roundTo(currentTime, 2),
    currentX: roundTo(snapshot.position.x, 2),
    currentY: roundTo(Math.max(snapshot.position.y, 0), 2),
    speed: roundTo(magnitude(snapshot.velocity), 2),
    maxHeight: roundTo(Math.max(maxHeight, 0), 2),
    range: roundTo(Math.max(range, 0), 2),
    flightTime: roundTo(Math.max(flightTime, 0), 2),
    timeToPeak: roundTo(Math.max(timeToPeak, 0), 2),
    peakPoint: {
      x: roundTo(initialVelocityX * timeToPeak, 2),
      y: roundTo(Math.max(maxHeight, 0), 2)
    },
    hasLanded
  };
}

export function createProjectileGraphSample(
  currentTime: number,
  snapshot: MotionState
): ProjectileGraphSample {
  return {
    timestamp: roundTo(currentTime, 2),
    x: roundTo(snapshot.position.x, 2),
    y: roundTo(Math.max(snapshot.position.y, 0), 2),
    speed: roundTo(magnitude(snapshot.velocity), 2)
  };
}

export function createIdealTrajectory(
  parameters: ProjectileMotionParameters,
  segments = 72
): Vector2[] {
  const initial = createInitialMotionState(parameters);
  const analytics = deriveProjectileAnalytics(parameters, initial, 0, false);

  if (analytics.flightTime === 0) {
    return [{ x: 0, y: 0 }];
  }

  return Array.from({ length: segments + 1 }, (_, index) => {
    const time = (analytics.flightTime * index) / segments;

    return {
      x: initial.velocity.x * time,
      y: Math.max(0, initial.velocity.y * time - 0.5 * parameters.gravity * time * time)
    };
  });
}

export function createWorldTransform(analytics: ProjectileAnalytics, snapshot: MotionState) {
  const worldWidth = Math.max(analytics.range * 1.12, snapshot.position.x + 10, 40);
  const worldHeight = Math.max(analytics.maxHeight * 1.35, snapshot.position.y + 12, 25);
  const usableWidth = CANVAS_VIEWBOX.width - CANVAS_VIEWBOX.paddingX * 2;
  const usableHeight =
    CANVAS_VIEWBOX.height - CANVAS_VIEWBOX.paddingTop - CANVAS_VIEWBOX.paddingBottom;

  const scaleX = usableWidth / worldWidth;
  const scaleY = usableHeight / worldHeight;

  return {
    worldWidth,
    worldHeight,
    toSvg(point: Vector2) {
      return {
        x: CANVAS_VIEWBOX.paddingX + point.x * scaleX,
        y: CANVAS_VIEWBOX.height - CANVAS_VIEWBOX.paddingBottom - point.y * scaleY
      };
    }
  };
}
