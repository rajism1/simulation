import type { WaveTemplateConfig } from "./types";

export const waveTemplateExample: WaveTemplateConfig<{
  amplitude: number;
  frequency: number;
  phase: number;
}> = {
  id: "wave-template",
  title: "Wave Template",
  description: "Reusable structure for oscillation, waveform rendering, and phase-sensitive graphing.",
  waveform: "sine",
  supportsPhase: true,
  supportsInterference: true,
  supportsDamping: false,
  supportsEnergyGraphs: false,
  defaultValues: {
    amplitude: 1,
    frequency: 2,
    phase: 0
  },
  parameters: [
    { id: "amplitude", label: "Amplitude", type: "slider", min: 0, max: 5, step: 0.1, defaultValue: 1 },
    { id: "frequency", label: "Frequency", type: "slider", min: 0.5, max: 10, step: 0.1, defaultValue: 2 },
    { id: "phase", label: "Phase", type: "slider", min: 0, max: 360, step: 1, defaultValue: 0 }
  ],
  formulas: [
    {
      id: "wave-eq",
      title: "Wave Function",
      latex: "y = A\\sin(\\omega t + \\phi)",
      mode: "block"
    }
  ],
  graphs: []
};
