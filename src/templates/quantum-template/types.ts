import type { ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";

export type QuantumTemplateConfig<TParams extends ParameterValues> = SimulationScaffoldConfig<TParams> & {
  eventMode: "discrete" | "probability";
  supportsEnergyLevels?: boolean;
  supportsPhotonEmission?: boolean;
};
