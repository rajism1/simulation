"use client";

import { startTransition, useCallback, useMemo, useState } from "react";

import { useSimulationPlayback } from "@/simulation-framework/playback";
import { WaveTemplate } from "@/templates/wave-template";

import { createPendulumGraphs, pendulumBaseConfig } from "./config";
import { PendulumCanvas } from "./PendulumCanvas";
import { PendulumSummary } from "./PendulumSummary";
import { createInitialPendulumSnapshot, createPendulumAnalytics } from "./physics";
import type { PendulumAnalytics, PendulumGraphSample } from "./types";

function createInitialAnalytics(): PendulumAnalytics {
  const snapshot = createInitialPendulumSnapshot(pendulumBaseConfig.defaultValues);
  return createPendulumAnalytics(snapshot, pendulumBaseConfig.defaultValues);
}

export function PendulumMotionSimulation() {
  const playback = useSimulationPlayback();
  const [analytics, setAnalytics] = useState<PendulumAnalytics>(createInitialAnalytics);
  const [samples, setSamples] = useState<PendulumGraphSample[]>([]);

  const handleSamplesChange = useCallback((nextSamples: PendulumGraphSample[]) => {
    startTransition(() => {
      setSamples(nextSamples);
    });
  }, []);

  const config = useMemo(
    () => ({
      ...pendulumBaseConfig,
      graphs: createPendulumGraphs(samples)
    }),
    [samples]
  );

  return (
    <WaveTemplate
      actions={playback.actions}
      canvasOverlay={
        <PendulumCanvas
          onAnalyticsChange={setAnalytics}
          onSamplesChange={handleSamplesChange}
          resetSignal={playback.resetSignal}
          status={playback.status}
        />
      }
      config={config}
      summary={<PendulumSummary analytics={analytics} />}
    />
  );
}
