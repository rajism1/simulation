"use client";

import { useMemo } from "react";

import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import { ElectricityTemplate } from "@/templates/electricity-template";

import { electricFieldBaseConfig } from "./config";
import { ElectricFieldCanvas } from "./ElectricFieldCanvas";
import { ElectricFieldSummary } from "./ElectricFieldSummary";
import { createElectricFieldAnalytics, createElectricFieldSnapshot, getPresetCharges } from "./physics";
import type { ElectricFieldParameters } from "./types";

function ElectricFieldSummaryBridge() {
  const { values } = useSimulationParameters();
  const parameters = values as ElectricFieldParameters;
  const snapshot = useMemo(
    () => createElectricFieldSnapshot(getPresetCharges(parameters.selectedPreset)),
    [parameters.selectedPreset]
  );
  const analytics = useMemo(() => createElectricFieldAnalytics(snapshot), [snapshot]);

  return <ElectricFieldSummary analytics={analytics} />;
}

export function ElectricFieldSimulation() {
  return (
    <ElectricityTemplate
      canvasOverlay={<ElectricFieldCanvas />}
      config={electricFieldBaseConfig}
      summary={<ElectricFieldSummaryBridge />}
    />
  );
}
