"use client";

import type { ReactNode } from "react";

import { TemplateScaffold } from "@/templates/shared/TemplateScaffold";
import type { SimulationControlAction } from "@/types/simulation";

import type { MechanicsTemplateConfig } from "./types";

type MechanicsTemplateProps<TParams extends Record<string, number | boolean | string>> = {
  config: MechanicsTemplateConfig<TParams>;
  canvasOverlay?: ReactNode;
  summary?: ReactNode;
  actions?: SimulationControlAction[];
};

export function MechanicsTemplate<TParams extends Record<string, number | boolean | string>>({
  config,
  canvasOverlay,
  summary,
  actions
}: MechanicsTemplateProps<TParams>) {
  return (
    <TemplateScaffold
      actions={actions}
      canvasOverlay={canvasOverlay}
      config={config}
      summary={summary}
    />
  );
}
