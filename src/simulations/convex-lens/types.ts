import type { LensImageResult } from "@/core/optics-engine";

export type ConvexLensSimulationParameters = {
  focalLength: number;
  objectDistance: number;
};

export type ConvexLensAnalytics = LensImageResult & {
  objectDistance: number;
  focalLength: number;
};
