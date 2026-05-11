"use client";

import { useMemo } from "react";

import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import { OpticsTemplate } from "@/templates/optics-template";

import { convexLensBaseConfig } from "./config";
import { ConvexLensCanvas } from "./ConvexLensCanvas";
import { ConvexLensSummary } from "./ConvexLensSummary";
import { createConvexLensAnalytics } from "./physics";
import type { ConvexLensSimulationParameters } from "./types";

function LensSummaryBridge() {
  const { values } = useSimulationParameters();
  const parameters = values as ConvexLensSimulationParameters;
  const analytics = useMemo(() => createConvexLensAnalytics(parameters), [parameters]);

  return <ConvexLensSummary analytics={analytics} />;
}

export function ConvexLensSimulation() {
  return (
    <OpticsTemplate
      canvasOverlay={<ConvexLensCanvas />}
      config={convexLensBaseConfig}
      summary={<LensSummaryBridge />}
    />
  );
}
