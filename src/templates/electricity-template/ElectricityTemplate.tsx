"use client";

import type { ReactNode } from "react";

import { TemplateScaffold } from "@/templates/shared/TemplateScaffold";
import type { SimulationControlAction } from "@/types/simulation";

import type { ElectricityTemplateConfig } from "./types";

type ElectricityTemplateProps<TParams extends Record<string, number | boolean | string>> = {
  config: ElectricityTemplateConfig<TParams>;
  canvasOverlay?: ReactNode;
  summary?: ReactNode;
  actions?: SimulationControlAction[];
};

export function ElectricityTemplate<TParams extends Record<string, number | boolean | string>>({
  config,
  canvasOverlay,
  summary,
  actions
}: ElectricityTemplateProps<TParams>) {
  return (
    <TemplateScaffold
      actions={actions}
      canvasOverlay={canvasOverlay}
      config={config}
      summary={summary}
    />
  );
}
