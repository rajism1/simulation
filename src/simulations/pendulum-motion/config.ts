import type { GraphDefinition } from "@/types/simulation";
import type { WaveTemplateConfig } from "@/templates/wave-template";

import type { PendulumGraphSample, PendulumParameters } from "./types";

export const pendulumBaseConfig: WaveTemplateConfig<PendulumParameters> = {
  id: "pendulum-motion",
  title: "Pendulum Motion",
  description:
    "Study how length, gravity, damping, and initial displacement affect a pendulum's angular motion and energy exchange.",
  waveform: "sine",
  supportsPhase: true,
  supportsInterference: false,
  supportsDamping: true,
  supportsEnergyGraphs: true,
  defaultValues: {
    length: 2.2,
    gravity: 9.8,
    damping: 0.05,
    initialAngle: 18
  },
  parameters: [
    {
      id: "length",
      label: "Length",
      type: "slider",
      min: 0.8,
      max: 3.5,
      step: 0.1,
      defaultValue: 2.2,
      description: "Longer pendulums oscillate more slowly.",
      formatValue: (value) => `${value.toFixed(1)} m`
    },
    {
      id: "gravity",
      label: "Gravity",
      type: "slider",
      min: 1.6,
      max: 18,
      step: 0.1,
      defaultValue: 9.8,
      description: "Higher gravity increases restoring torque and shortens the period.",
      formatValue: (value) => `${value.toFixed(1)} m/s^2`
    },
    {
      id: "damping",
      label: "Damping",
      type: "slider",
      min: 0,
      max: 0.25,
      step: 0.01,
      defaultValue: 0.05,
      description: "Represents energy loss due to air resistance or friction.",
      formatValue: (value) => value.toFixed(2)
    },
    {
      id: "initialAngle",
      label: "Initial Angle",
      type: "slider",
      min: 5,
      max: 30,
      step: 1,
      defaultValue: 18,
      description: "Initial angular displacement from equilibrium.",
      formatValue: (value) => `${value.toFixed(0)} deg`
    }
  ],
  formulas: [
    {
      id: "pendulum-period",
      title: "Small-Angle Period",
      latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}",
      description: "For small oscillations, the period depends mainly on length and gravity.",
      mode: "block"
    },
    {
      id: "angular-displacement",
      title: "Angular Displacement",
      latex: "\\theta(t) = \\theta_0 e^{-\\beta t}\\cos(\\omega_d t)",
      description: "Damping reduces the swing envelope over time.",
      mode: "block"
    },
    {
      id: "pendulum-energy",
      title: "Potential Energy",
      latex: "U = mgL(1 - \\cos\\theta)",
      description: "At the ends of the swing, potential energy is maximum and kinetic energy is minimum.",
      mode: "block"
    }
  ],
  graphs: []
};

export function createPendulumGraphs(samples: PendulumGraphSample[]): GraphDefinition[] {
  return [
    {
      id: "angular-displacement-vs-time",
      title: "angular displacement vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "theta (deg)",
      data: samples,
      series: [{ id: "angleDegrees", label: "Angular Displacement", color: "#8b5cf6" }]
    },
    {
      id: "pendulum-energy-vs-time",
      title: "energy vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "energy",
      data: samples,
      series: [
        { id: "kineticEnergy", label: "Kinetic Energy", color: "#f97316" },
        { id: "potentialEnergy", label: "Potential Energy", color: "#14b8a6" },
        { id: "totalEnergy", label: "Total Energy", color: "#eab308" }
      ]
    }
  ];
}
