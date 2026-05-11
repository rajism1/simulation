import type { OpticsTemplateConfig } from "@/templates/optics-template";

import type { ConvexLensSimulationParameters } from "./types";

export const convexLensBaseConfig: OpticsTemplateConfig<ConvexLensSimulationParameters> = {
  id: "convex-lens",
  title: "Convex Lens Simulation",
  description:
    "Explore principal rays, focal length, object distance, and how a convex lens forms real or virtual images.",
  rayMode: "lens",
  supportsPrincipalRays: true,
  defaultValues: {
    focalLength: 14,
    objectDistance: 28
  },
  parameters: [
    {
      id: "focalLength",
      label: "Focal Length",
      type: "slider",
      min: 6,
      max: 24,
      step: 1,
      defaultValue: 14,
      description: "Moves the focus points and changes how strongly the lens bends incoming rays.",
      formatValue: (value) => `${value.toFixed(0)} cm`
    },
    {
      id: "objectDistance",
      label: "Object Distance",
      type: "slider",
      min: 6,
      max: 60,
      step: 1,
      defaultValue: 28,
      description: "Controls where the object is placed relative to the optical center of the lens.",
      formatValue: (value) => `${value.toFixed(0)} cm`
    }
  ],
  formulas: [
    {
      id: "lens-equation",
      title: "Lens Formula",
      latex: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
      description: "Links focal length, object distance, and image distance for a thin convex lens.",
      mode: "block"
    },
    {
      id: "magnification",
      title: "Magnification",
      latex: "m = \\frac{h_i}{h_o} = -\\frac{v}{u}",
      description: "Shows whether the image is enlarged or diminished, upright or inverted.",
      mode: "block"
    }
  ],
  graphs: []
};
