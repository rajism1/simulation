import { addVectors, scaleVector, type Vector2 } from "@/core/vector-engine";

export type MotionState = {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
};

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export const EARTH_GRAVITY = 9.80665;

export const calculateVelocity = (
  initialVelocity: Vector2,
  acceleration: Vector2,
  deltaTime: number
) => addVectors(initialVelocity, scaleVector(acceleration, deltaTime));

export const calculateDisplacement = (
  initialVelocity: Vector2,
  acceleration: Vector2,
  deltaTime: number
) =>
  addVectors(
    scaleVector(initialVelocity, deltaTime),
    scaleVector(acceleration, 0.5 * deltaTime * deltaTime)
  );

export const gravityVector = (gravity = EARTH_GRAVITY): Vector2 => ({
  x: 0,
  y: gravity
});

export const integrateMotion = (state: MotionState, deltaTime: number): MotionState => {
  const nextVelocity = calculateVelocity(state.velocity, state.acceleration, deltaTime);
  const displacement = calculateDisplacement(state.velocity, state.acceleration, deltaTime);

  return {
    ...state,
    velocity: nextVelocity,
    position: addVectors(state.position, displacement)
  };
};

export const isOutOfBounds = (position: Vector2, bounds: Bounds) =>
  position.x < bounds.minX ||
  position.x > bounds.maxX ||
  position.y < bounds.minY ||
  position.y > bounds.maxY;

export const resolveBoundaryCollision = (
  position: Vector2,
  velocity: Vector2,
  bounds: Bounds,
  restitution = 0.85
) => {
  let nextPosition = position;
  let nextVelocity = velocity;

  if (position.x < bounds.minX || position.x > bounds.maxX) {
    nextPosition = {
      ...nextPosition,
      x: Math.min(Math.max(position.x, bounds.minX), bounds.maxX)
    };
    nextVelocity = { ...nextVelocity, x: -velocity.x * restitution };
  }

  if (position.y < bounds.minY || position.y > bounds.maxY) {
    nextPosition = {
      ...nextPosition,
      y: Math.min(Math.max(position.y, bounds.minY), bounds.maxY)
    };
    nextVelocity = { ...nextVelocity, y: -velocity.y * restitution };
  }

  return {
    position: nextPosition,
    velocity: nextVelocity
  };
};
