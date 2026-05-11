import type { ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";

export type WaveTemplateConfig<TParams extends ParameterValues> = SimulationScaffoldConfig<TParams> & {
  waveform: "sine" | "square" | "custom";
  supportsPhase?: boolean;
  supportsInterference?: boolean;
  supportsDamping?: boolean;
  supportsEnergyGraphs?: boolean;
};
