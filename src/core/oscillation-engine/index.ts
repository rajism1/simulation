import { degreesToRadians, roundTo } from "@/core/math-engine";

export type OscillationParameters = {
  amplitude: number;
  frequency: number;
  damping: number;
  phase: number;
  mass?: number;
};

export type OscillationSnapshot = {
  time: number;
  displacement: number;
  velocity: number;
  acceleration: number;
  phaseRadians: number;
  angularFrequency: number;
  dampedAngularFrequency: number;
  damping: number;
  mass: number;
  springConstant: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
};

export type PendulumParameters = {
  length: number;
  gravity: number;
  damping: number;
  initialAngle: number;
  mass?: number;
};

export type PendulumSnapshot = {
  time: number;
  angle: number;
  angularVelocity: number;
  angularAcceleration: number;
  phaseRadians: number;
  angularFrequency: number;
  dampedAngularFrequency: number;
  damping: number;
  length: number;
  gravity: number;
  mass: number;
  tangentialVelocity: number;
  heightDelta: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
};

export const DEFAULT_OSCILLATOR_MASS = 1;

export function deriveOscillationConstants(parameters: OscillationParameters) {
  const mass = parameters.mass ?? DEFAULT_OSCILLATOR_MASS;
  const angularFrequency = 2 * Math.PI * parameters.frequency;
  const damping = Math.max(parameters.damping, 0);
  const dampedAngularFrequency = Math.sqrt(
    Math.max(angularFrequency * angularFrequency - damping * damping, 0)
  );
  const phaseRadians = degreesToRadians(parameters.phase);
  const springConstant = mass * angularFrequency * angularFrequency;

  return {
    mass,
    damping,
    angularFrequency,
    dampedAngularFrequency,
    phaseRadians,
    springConstant
  };
}

export function sampleOscillation(
  parameters: OscillationParameters,
  time: number
): OscillationSnapshot {
  const constants = deriveOscillationConstants(parameters);
  const envelope = Math.exp(-constants.damping * time);
  const theta = constants.dampedAngularFrequency * time + constants.phaseRadians;
  const displacement = parameters.amplitude * envelope * Math.cos(theta);
  const velocity =
    parameters.amplitude *
    envelope *
    (-constants.damping * Math.cos(theta) - constants.dampedAngularFrequency * Math.sin(theta));
  const acceleration =
    parameters.amplitude *
    envelope *
    ((constants.damping * constants.damping -
      constants.dampedAngularFrequency * constants.dampedAngularFrequency) *
      Math.cos(theta) +
      2 * constants.damping * constants.dampedAngularFrequency * Math.sin(theta));
  const kineticEnergy = 0.5 * constants.mass * velocity * velocity;
  const potentialEnergy =
    0.5 * constants.springConstant * displacement * displacement;
  const totalEnergy = kineticEnergy + potentialEnergy;

  return {
    time: roundTo(time, 3),
    displacement,
    velocity,
    acceleration,
    phaseRadians: theta,
    angularFrequency: constants.angularFrequency,
    dampedAngularFrequency: constants.dampedAngularFrequency,
    damping: constants.damping,
    mass: constants.mass,
    springConstant: constants.springConstant,
    kineticEnergy,
    potentialEnergy,
    totalEnergy
  };
}

export function createOscillationSeries(
  parameters: OscillationParameters,
  duration: number,
  segments = 120
) {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const time = (duration * index) / segments;
    return sampleOscillation(parameters, time);
  });
}

export function estimateOscillationWindow(parameters: OscillationParameters) {
  const constants = deriveOscillationConstants(parameters);
  const basePeriod =
    constants.dampedAngularFrequency > 0
      ? (2 * Math.PI) / constants.dampedAngularFrequency
      : 1 / Math.max(parameters.frequency, 0.1);

  return {
    period: basePeriod,
    duration: Math.max(basePeriod * 3, 6)
  };
}

export function derivePendulumConstants(parameters: PendulumParameters) {
  const mass = parameters.mass ?? DEFAULT_OSCILLATOR_MASS;
  const length = Math.max(parameters.length, 0.1);
  const gravity = Math.max(parameters.gravity, 0.0001);
  const damping = Math.max(parameters.damping, 0);
  const angularFrequency = Math.sqrt(gravity / length);
  const dampedAngularFrequency = Math.sqrt(
    Math.max(angularFrequency * angularFrequency - damping * damping, 0)
  );
  const phaseRadians = degreesToRadians(parameters.initialAngle);

  return {
    mass,
    length,
    gravity,
    damping,
    angularFrequency,
    dampedAngularFrequency,
    phaseRadians
  };
}

export function samplePendulum(
  parameters: PendulumParameters,
  time: number
): PendulumSnapshot {
  const constants = derivePendulumConstants(parameters);
  const envelope = Math.exp(-constants.damping * time);
  const theta = constants.dampedAngularFrequency * time + constants.phaseRadians;
  const angle = constants.phaseRadians * envelope * Math.cos(constants.dampedAngularFrequency * time);
  const angularVelocity =
    constants.phaseRadians *
    envelope *
    (-constants.damping * Math.cos(constants.dampedAngularFrequency * time) -
      constants.dampedAngularFrequency * Math.sin(constants.dampedAngularFrequency * time));
  const angularAcceleration =
    constants.phaseRadians *
    envelope *
    ((constants.damping * constants.damping -
      constants.dampedAngularFrequency * constants.dampedAngularFrequency) *
      Math.cos(constants.dampedAngularFrequency * time) +
      2 * constants.damping * constants.dampedAngularFrequency * Math.sin(constants.dampedAngularFrequency * time));
  const tangentialVelocity = constants.length * angularVelocity;
  const heightDelta = constants.length * (1 - Math.cos(angle));
  const kineticEnergy = 0.5 * constants.mass * tangentialVelocity * tangentialVelocity;
  const potentialEnergy = constants.mass * constants.gravity * heightDelta;
  const totalEnergy = kineticEnergy + potentialEnergy;

  return {
    time: roundTo(time, 3),
    angle,
    angularVelocity,
    angularAcceleration,
    phaseRadians: theta,
    angularFrequency: constants.angularFrequency,
    dampedAngularFrequency: constants.dampedAngularFrequency,
    damping: constants.damping,
    length: constants.length,
    gravity: constants.gravity,
    mass: constants.mass,
    tangentialVelocity,
    heightDelta,
    kineticEnergy,
    potentialEnergy,
    totalEnergy
  };
}

export function estimatePendulumWindow(parameters: PendulumParameters) {
  const constants = derivePendulumConstants(parameters);
  const basePeriod =
    constants.dampedAngularFrequency > 0
      ? (2 * Math.PI) / constants.dampedAngularFrequency
      : 2 * Math.PI * Math.sqrt(constants.length / constants.gravity);

  return {
    period: basePeriod,
    duration: Math.max(basePeriod * 3, 8)
  };
}
