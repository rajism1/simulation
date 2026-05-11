export type Vector2 = {
  x: number;
  y: number;
};

export const createVector = (x = 0, y = 0): Vector2 => ({ x, y });

export const addVectors = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x + b.x,
  y: a.y + b.y
});

export const subtractVectors = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x - b.x,
  y: a.y - b.y
});

export const scaleVector = (vector: Vector2, scalar: number): Vector2 => ({
  x: vector.x * scalar,
  y: vector.y * scalar
});

export const magnitude = (vector: Vector2) => Math.hypot(vector.x, vector.y);

export const normalize = (vector: Vector2): Vector2 => {
  const length = magnitude(vector);

  if (length === 0) {
    return createVector(0, 0);
  }

  return scaleVector(vector, 1 / length);
};

export const dotProduct = (a: Vector2, b: Vector2) => a.x * b.x + a.y * b.y;

export const vectorAngle = (vector: Vector2) => Math.atan2(vector.y, vector.x);

export const distanceBetween = (a: Vector2, b: Vector2) => magnitude(subtractVectors(a, b));
