import {
  addVectors,
  createVector,
  distanceBetween,
  magnitude,
  normalize,
  scaleVector,
  subtractVectors,
  type Vector2
} from "@/core/vector-engine";
import { roundTo } from "@/core/math-engine";

export type Charge = {
  id: string;
  x: number;
  y: number;
  magnitude: number;
};

export type FieldSample = {
  position: Vector2;
  field: Vector2;
  strength: number;
  potential: number;
};

const MIN_DISTANCE = 14;

export function electricFieldAtPoint(charges: Charge[], point: Vector2) {
  return charges.reduce((field, charge) => {
    const displacement = subtractVectors(point, { x: charge.x, y: charge.y });
    const distance = Math.max(magnitude(displacement), MIN_DISTANCE);
    const direction = normalize(displacement);
    const strength = charge.magnitude / (distance * distance);

    return addVectors(field, scaleVector(direction, strength));
  }, createVector(0, 0));
}

export function electricPotentialAtPoint(charges: Charge[], point: Vector2) {
  return charges.reduce((potential, charge) => {
    const distance = Math.max(
      distanceBetween(point, { x: charge.x, y: charge.y }),
      MIN_DISTANCE
    );

    return potential + charge.magnitude / distance;
  }, 0);
}

export function sampleFieldGrid(
  charges: Charge[],
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  step: number
) {
  const samples: FieldSample[] = [];

  for (let y = bounds.minY; y <= bounds.maxY; y += step) {
    for (let x = bounds.minX; x <= bounds.maxX; x += step) {
      const position = { x, y };
      const field = electricFieldAtPoint(charges, position);
      const strength = magnitude(field);
      const potential = electricPotentialAtPoint(charges, position);

      samples.push({
        position,
        field,
        strength,
        potential
      });
    }
  }

  return samples;
}

export function traceFieldLine(
  charges: Charge[],
  start: Vector2,
  direction = 1,
  stepSize = 12,
  iterations = 48
) {
  const points: Vector2[] = [start];
  let current = start;

  for (let index = 0; index < iterations; index += 1) {
    const field = electricFieldAtPoint(charges, current);
    const fieldMagnitude = magnitude(field);

    if (fieldMagnitude < 0.0001) {
      break;
    }

    const next = addVectors(current, scaleVector(normalize(field), stepSize * direction));
    points.push(next);
    current = next;
  }

  return points;
}

export function totalCharge(charges: Charge[]) {
  return roundTo(charges.reduce((sum, charge) => sum + charge.magnitude, 0), 2);
}
