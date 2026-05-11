import type { GraphDefinition, ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";
import type { Vector2 } from "@/core/vector-engine";

export type MechanicsTemplateConfig<TParams extends ParameterValues> = SimulationScaffoldConfig<TParams> & {
  coordinateSystem: "cartesian" | "polar";
  showVectors?: boolean;
  showTrajectory?: boolean;
  graphPresets?: GraphDefinition[];
};

export type MechanicsSnapshot = {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  trail: Vector2[];
};
