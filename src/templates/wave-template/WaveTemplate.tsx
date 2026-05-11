"use client";

import type { ReactNode } from "react";

import { TemplateScaffold } from "@/templates/shared/TemplateScaffold";
import type { SimulationControlAction } from "@/types/simulation";

import type { WaveTemplateConfig } from "./types";

type WaveTemplateProps<TParams extends Record<string, number | boolean | string>> = {
  config: WaveTemplateConfig<TParams>;
  canvasOverlay?: ReactNode;
  summary?: ReactNode;
  actions?: SimulationControlAction[];
};

export function WaveTemplate<TParams extends Record<string, number | boolean | string>>({
  config,
  canvasOverlay,
  summary,
  actions
}: WaveTemplateProps<TParams>) {
  return (
    <TemplateScaffold
      actions={actions}
      canvasOverlay={canvasOverlay}
      config={config}
      summary={summary}
    />
  );
}
