import type { MechanicsTemplateConfig } from "./types";

export const mechanicsTemplateExample: MechanicsTemplateConfig<{
  launchAngle: number;
  launchSpeed: number;
  gravityScale: number;
  showVectors: boolean;
}> = {
  id: "mechanics-template",
  title: "Mechanics Template",
  description: "Reusable scaffold for gravity, vectors, collisions, trails, and motion graphs.",
  coordinateSystem: "cartesian",
  showTrajectory: true,
  showVectors: true,
  defaultValues: {
    launchAngle: 45,
    launchSpeed: 20,
    gravityScale: 1,
    showVectors: true
  },
  parameters: [
    {
      id: "launchAngle",
      label: "Angle",
      type: "slider",
      min: 0,
      max: 90,
      step: 1,
      defaultValue: 45
    },
    {
      id: "launchSpeed",
      label: "Speed",
      type: "slider",
      min: 5,
      max: 60,
      step: 1,
      defaultValue: 20
    },
    {
      id: "gravityScale",
      label: "Gravity Multiplier",
      type: "numeric",
      min: 0.1,
      max: 3,
      step: 0.1,
      defaultValue: 1
    },
    {
      id: "showVectors",
      label: "Show Vectors",
      type: "toggle",
      defaultValue: true
    }
  ],
  formulas: [
    {
      id: "kinematics-1",
      title: "Displacement",
      latex: "s = ut + \\frac{1}{2}at^2",
      mode: "block"
    }
  ],
  graphs: [],
  graphPresets: []
};
