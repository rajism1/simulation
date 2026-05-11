import type { GraphDefinition } from "@/types/simulation";
import type { WaveTemplateConfig } from "@/templates/wave-template";

import type { SHMGraphSample, SHMParameters } from "./types";

export const shmBaseConfig: WaveTemplateConfig<SHMParameters> = {
  id: "simple-harmonic-motion",
  title: "Simple Harmonic Motion",
  description:
    "Investigate how amplitude, frequency, damping, and phase shape the motion of a mass-spring oscillator and redistribute energy over time.",
  waveform: "sine",
  supportsPhase: true,
  supportsInterference: false,
  supportsDamping: true,
  supportsEnergyGraphs: true,
  defaultValues: {
    amplitude: 120,
    frequency: 0.45,
    damping: 0.08,
    phase: 0
  },
  parameters: [
    {
      id: "amplitude",
      label: "Amplitude",
      type: "slider",
      min: 40,
      max: 180,
      step: 5,
      defaultValue: 120,
      description: "Maximum displacement from the equilibrium position.",
      formatValue: (value) => `${value.toFixed(0)} px`
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "slider",
      min: 0.2,
      max: 1.2,
      step: 0.05,
      defaultValue: 0.45,
      description: "Controls how quickly the oscillator completes each cycle.",
      formatValue: (value) => `${value.toFixed(2)} Hz`
    },
    {
      id: "damping",
      label: "Damping",
      type: "slider",
      min: 0,
      max: 0.35,
      step: 0.01,
      defaultValue: 0.08,
      description: "Adds energy loss so the oscillation envelope decays gradually.",
      formatValue: (value) => value.toFixed(2)
    },
    {
      id: "phase",
      label: "Phase",
      type: "slider",
      min: 0,
      max: 360,
      step: 5,
      defaultValue: 0,
      description: "Offsets the wave at the start of the motion.",
      formatValue: (value) => `${value.toFixed(0)} deg`
    }
  ],
  formulas: [
    {
      id: "shm-displacement",
      title: "Displacement",
      latex: "x(t) = A e^{-\\beta t}\\cos(\\omega_d t + \\phi)",
      description: "Damping shrinks the amplitude envelope while phase shifts the starting point.",
      mode: "block"
    },
    {
      id: "angular-frequency",
      title: "Angular Frequency",
      latex: "\\omega = 2\\pi f",
      description: "Frequency sets how quickly the mass repeats its cycle.",
      mode: "block"
    },
    {
      id: "spring-energy",
      title: "Spring Potential Energy",
      latex: "U = \\frac{1}{2} k x^2",
      description: "As displacement grows, spring potential energy increases quadratically.",
      mode: "block"
    }
  ],
  graphs: []
};

export function createSHMGraphs(samples: SHMGraphSample[]): GraphDefinition[] {
  return [
    {
      id: "displacement-vs-time",
      title: "displacement vs time",
      xAxisKey: "timestamp",
      yAxisLabel: "x",
      data: samples,
      series: [{ id: "displacement", label: "Displacement", color: "#2b8fff" }]
    },
    {
      id: "energy-vs-time",
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
