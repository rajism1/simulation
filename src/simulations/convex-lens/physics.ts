import {
  createPrincipalRays,
  solveConvexLensImage,
  type ConvexLensParameters
} from "@/core/optics-engine";

import type {
  ConvexLensAnalytics,
  ConvexLensSimulationParameters
} from "./types";

export const LENS_VIEWBOX = {
  width: 1000,
  height: 560
};

export const OBJECT_HEIGHT = 120;

export function createLensParameters(
  parameters: ConvexLensSimulationParameters
): ConvexLensParameters {
  return {
    focalLength: parameters.focalLength,
    objectDistance: parameters.objectDistance,
    objectHeight: OBJECT_HEIGHT
  };
}

export function createConvexLensAnalytics(
  parameters: ConvexLensSimulationParameters
): ConvexLensAnalytics {
  const resolved = solveConvexLensImage(createLensParameters(parameters));

  return {
    ...resolved,
    objectDistance: parameters.objectDistance,
    focalLength: parameters.focalLength
  };
}

export function createLensScene(parameters: ConvexLensSimulationParameters) {
  const opticsParameters = createLensParameters(parameters);
  const image = solveConvexLensImage(opticsParameters);
  const rays = createPrincipalRays(opticsParameters, image);

  return {
    image,
    rays
  };
}
