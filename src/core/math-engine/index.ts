export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export const inverseLerp = (start: number, end: number, value: number) => {
  if (start === end) {
    return 0;
  }

  return clamp((value - start) / (end - start), 0, 1);
};

export const scaleLinear = (
  value: number,
  inputRange: [number, number],
  outputRange: [number, number]
) => {
  const progress = inverseLerp(inputRange[0], inputRange[1], value);
  return lerp(outputRange[0], outputRange[1], progress);
};

export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
export const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;

export const secondsToMilliseconds = (seconds: number) => seconds * 1000;
export const millisecondsToSeconds = (milliseconds: number) => milliseconds / 1000;

export const roundTo = (value: number, precision = 2) => {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
};
