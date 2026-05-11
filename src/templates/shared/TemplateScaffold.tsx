"use client";

import type { ReactNode } from "react";

import { GraphPanel } from "@/simulation-framework/charts";
import { FormulaPanel } from "@/simulation-framework/formula-panel";
import { SimulationParameterProvider } from "@/simulation-framework/parameter-system";
import {
  SimulationCanvas,
  SimulationControls,
  SimulationHeader,
  SimulationShell
} from "@/simulation-framework/simulation-shell";
import type { SimulationControlAction } from "@/types/simulation";
import type { ParameterValues, SimulationScaffoldConfig } from "@/types/simulation";

type TemplateScaffoldProps<TParams extends ParameterValues> = {
  config: SimulationScaffoldConfig<TParams>;
  canvasOverlay?: ReactNode;
  summary?: ReactNode;
  actions?: SimulationControlAction[];
};

export function TemplateScaffold<TParams extends ParameterValues>({
  config,
  canvasOverlay,
  summary,
  actions
}: TemplateScaffoldProps<TParams>) {
  return (
    <SimulationParameterProvider defaults={config.defaultValues}>
      <SimulationShell
        canvas={<SimulationCanvas overlay={canvasOverlay} title={config.title} />}
        controls={<SimulationControls actions={actions} parameters={config.parameters} />}
        formulas={config.formulas ? <FormulaPanel formulas={config.formulas} /> : null}
        graphs={config.graphs ? <GraphPanel graphs={config.graphs} /> : null}
        header={<SimulationHeader description={config.description} title={config.title} />}
        summary={summary}
      />
    </SimulationParameterProvider>
  );
}
