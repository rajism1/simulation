import type { QuantumTemplateConfig } from "./types";

export const quantumTemplateExample: QuantumTemplateConfig<{
  lightFrequency: number;
  workFunction: number;
  photonFlux: number;
}> = {
  id: "quantum-template",
  title: "Quantum Template",
  description: "Reusable quantum scaffold for energy levels, stochastic events, and photon/electron interactions.",
  eventMode: "probability",
  supportsEnergyLevels: true,
  supportsPhotonEmission: true,
  defaultValues: {
    lightFrequency: 6,
    workFunction: 2.3,
    photonFlux: 50
  },
  parameters: [
    { id: "lightFrequency", label: "Light Frequency", type: "slider", min: 1, max: 10, step: 0.1, defaultValue: 6 },
    { id: "workFunction", label: "Work Function", type: "numeric", min: 1, max: 5, step: 0.1, defaultValue: 2.3 },
    { id: "photonFlux", label: "Photon Flux", type: "slider", min: 0, max: 100, step: 1, defaultValue: 50 }
  ],
  formulas: [
    {
      id: "planck-relation",
      title: "Photon Energy",
      latex: "E = h\\nu",
      mode: "block"
    }
  ],
  graphs: []
};
