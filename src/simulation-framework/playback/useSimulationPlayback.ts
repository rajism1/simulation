"use client";

import { useCallback, useMemo, useState } from "react";

import type { SimulationControlAction, SimulationStatus } from "@/types/simulation";

export function useSimulationPlayback() {
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [resetSignal, setResetSignal] = useState(0);

  const play = useCallback(() => {
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResetSignal((value) => value + 1);
  }, []);

  const autoPause = useCallback(() => {
    setStatus("paused");
  }, []);

  const actions: SimulationControlAction[] = useMemo(
    () => [
      {
        label: "Play",
        onClick: play,
        variant: "primary"
      },
      {
        label: "Pause",
        onClick: pause,
        variant: "ghost"
      },
      {
        label: "Reset",
        onClick: reset,
        variant: "secondary"
      }
    ],
    [pause, play, reset]
  );

  return {
    status,
    resetSignal,
    actions,
    play,
    pause,
    reset,
    autoPause,
    setStatus
  };
}
