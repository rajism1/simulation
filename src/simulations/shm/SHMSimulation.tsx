"use client";

import { startTransition, useCallback, useMemo, useState } from "react";

import { useSimulationPlayback } from "@/simulation-framework/playback";
import { WaveTemplate } from "@/templates/wave-template";

import { createSHMGraphs, shmBaseConfig } from "./config";
import { SHMCanvas } from "./SHMCanvas";
import { SHMSummary } from "./SHMSummary";
import { createInitialSHMSnapshot, createSHMAnalytics } from "./physics";
import type { SHMAnalytics, SHMGraphSample } from "./types";

function createInitialAnalytics(): SHMAnalytics {
  const initialSnapshot = createInitialSHMSnapshot(shmBaseConfig.defaultValues);
  return createSHMAnalytics(initialSnapshot, shmBaseConfig.defaultValues);
}

export function SHMSimulation() {
  const playback = useSimulationPlayback();
  const [analytics, setAnalytics] = useState<SHMAnalytics>(createInitialAnalytics);
  const [samples, setSamples] = useState<SHMGraphSample[]>([]);

  const handleSamplesChange = useCallback((nextSamples: SHMGraphSample[]) => {
    startTransition(() => {
      setSamples(nextSamples);
    });
  }, []);

  const config = useMemo(
    () => ({
      ...shmBaseConfig,
      graphs: createSHMGraphs(samples)
    }),
    [samples]
  );

  return (
    <WaveTemplate
      actions={playback.actions}
      canvasOverlay={
        <SHMCanvas
          onAnalyticsChange={setAnalytics}
          onSamplesChange={handleSamplesChange}
          resetSignal={playback.resetSignal}
          status={playback.status}
        />
      }
      config={config}
      summary={<SHMSummary analytics={analytics} />}
    />
  );
}
