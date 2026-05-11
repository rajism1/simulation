"use client";

import { startTransition, useCallback, useMemo, useState } from "react";

import { useSimulationPlayback } from "@/simulation-framework/playback";
import { MechanicsTemplate } from "@/templates/mechanics-template";

import { createProjectileGraphs, projectileMotionBaseConfig } from "./config";
import { ProjectileMotionCanvas } from "./ProjectileMotionCanvas";
import { ProjectileMotionSummary } from "./ProjectileMotionSummary";
import { createInitialMotionState, deriveProjectileAnalytics } from "./physics";
import type {
  ProjectileAnalytics,
  ProjectileGraphSample
} from "./types";

function createInitialAnalytics(): ProjectileAnalytics {
  const initialSnapshot = createInitialMotionState(projectileMotionBaseConfig.defaultValues);

  return deriveProjectileAnalytics(
    projectileMotionBaseConfig.defaultValues,
    initialSnapshot,
    0,
    false
  );
}

export function ProjectileMotionSimulation() {
  const playback = useSimulationPlayback();
  const [analytics, setAnalytics] = useState<ProjectileAnalytics>(createInitialAnalytics);
  const [samples, setSamples] = useState<ProjectileGraphSample[]>([]);

  const handleSamplesChange = useCallback((nextSamples: ProjectileGraphSample[]) => {
    startTransition(() => {
      setSamples(nextSamples);
    });
  }, []);

  const config = useMemo(
    () => ({
      ...projectileMotionBaseConfig,
      graphs: createProjectileGraphs(samples)
    }),
    [samples]
  );

  return (
    <MechanicsTemplate
      actions={playback.actions}
      canvasOverlay={
        <ProjectileMotionCanvas
          onAnalyticsChange={setAnalytics}
          onAutoPause={playback.autoPause}
          onSamplesChange={handleSamplesChange}
          resetSignal={playback.resetSignal}
          status={playback.status}
        />
      }
      config={config}
      summary={<ProjectileMotionSummary analytics={analytics} />}
    />
  );
}
