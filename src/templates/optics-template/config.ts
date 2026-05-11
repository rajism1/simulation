import type { OpticsTemplateConfig } from "./types";

export const opticsTemplateExample: OpticsTemplateConfig<{
  focalLength: number;
  refractiveIndex: number;
  rayCount: string;
}> = {
  id: "optics-template",
  title: "Optics Template",
  description: "Reusable optics shell for ray tracing, focal calculations, and lens-driven visual overlays.",
  rayMode: "lens",
  supportsPrincipalRays: true,
  defaultValues: {
    focalLength: 20,
    refractiveIndex: 1.5,
    rayCount: "3"
  },
  parameters: [
    { id: "focalLength", label: "Focal Length", type: "slider", min: 5, max: 50, step: 1, defaultValue: 20 },
    { id: "refractiveIndex", label: "Refractive Index", type: "numeric", min: 1, max: 3, step: 0.1, defaultValue: 1.5 },
    { id: "rayCount", label: "Ray Count", type: "dropdown", defaultValue: "3", options: [{ label: "3 Rays", value: "3" }, { label: "5 Rays", value: "5" }, { label: "7 Rays", value: "7" }] }
  ],
  formulas: [
    {
      id: "lens-formula",
      title: "Lens Formula",
      latex: "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
      mode: "block"
    }
  ],
  graphs: []
};
