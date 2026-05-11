import type { ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";

export type ElectricityTemplateConfig<TParams extends ParameterValues> = SimulationScaffoldConfig<TParams> & {
  fieldMode: "lines" | "particles" | "potential";
  supportsChargePlacement?: boolean;
};
