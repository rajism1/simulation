import type { GraphDefinition } from "@/types/simulation";
import type { MechanicsTemplateConfig } from "@/templates/mechanics-template";

import type { ProjectileGraphSample, ProjectileMotionParameters } from "./types";

export const projectileMotionBaseConfig: MechanicsTemplateConfig<ProjectileMotionParameters> = {
  id: "projectile-motion",
  title: "Projectile Motion",
  description:
    "Explore how launch angle, initial velocity, and gravity shape the path, range, peak height, and velocity of a projectile.",
  coordinateSystem: "cartesian",
  showTrajectory: true,
  showVectors: true,
  defaultValues: {
    launchAngle: 45,
    launchVelocity: 26,
    gravity: 9.8
  },
  parameters: [
    {
      id: "launchAngle",
      label: "Launch Angle",
      type: "slider",
      min: 10,
      max: 80,
      step: 1,
      defaultValue: 45,
      description: "Changes the vertical and horizontal split of the launch velocity.",
      formatValue: (value) => `${value.toFixed(0)} deg`
    },
    {
      id: "launchVelocity",
      label: "Initial Velocity",
      type: "slider",
      min: 10,
      max: 50,
      step: 1,
      defaultValue: 26,
      description: "Sets the magnitude of the launch vector.",
      formatValue: (value) => `${value.toFixed(0)} m/s`
    },
    {
      id: "gravity",
      label: "Gravity",
      type: "slider",
      min: 1.6,
      max: 18,
      step: 0.1,
      defaultValue: 9.8,
      description: "Controls downward acceleration to compare different environments.",
      formatValue: (value) => `${value.toFixed(1)} m/s^2`
    }
  ],
  formulas: [
    {
      id: "horizontal-position",
      title: "Horizontal Position",
      latex: "x(t) = u\\cos\\theta \\cdot t",
      description: "Horizontal velocity remains constant when air resistance is ignored.",
      mode: "block"
    },
    {
      id: "vertical-position",
      title: "Vertical Position",
      latex: "y(t) = u\\sin\\theta \\cdot t - \\frac{1}{2}gt^2",
      description: "Vertical motion is uniformly accelerated by gravity.",
      mode: "block"
    },
    {
      id: "range-equation",
      title: "Range",
      latex: "R = \\frac{u^2\\sin 2\\theta}{g}",
      description: "The total horizontal distance depends on launch speed, angle, and gravity.",
      mode: "block"
    }
  ],
  graphs: []
};

export function createProjectileGraphs(samples: ProjectileGraphSample[]): GraphDefinition[] {
  return [
    {
      id: "x-vs-time",
      title: "x vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "x (m)",
      data: samples,
      series: [{ id: "x", label: "Horizontal Displacement", color: "#2b8fff" }]
    },
    {
      id: "y-vs-time",
      title: "y vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "y (m)",
      data: samples,
      series: [{ id: "y", label: "Vertical Displacement", color: "#f97316" }]
    },
    {
      id: "velocity-vs-time",
      title: "velocity vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "speed (m/s)",
      data: samples,
      series: [{ id: "speed", label: "Speed", color: "#0f766e" }]
    }
  ];
}
