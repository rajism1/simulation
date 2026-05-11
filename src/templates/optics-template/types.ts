import type { ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";

export type OpticsTemplateConfig<TParams extends ParameterValues> = SimulationScaffoldConfig<TParams> & {
  rayMode: "reflection" | "refraction" | "lens";
  supportsPrincipalRays?: boolean;
};
