"use client";

import { useCallback, useEffect, useRef } from "react";

type AnimationFrameOptions = {
  isRunning: boolean;
  onFrame: (deltaTime: number, elapsedTime: number) => void;
  maxDeltaTime?: number;
};

export function useAnimationFrame({
  isRunning,
  onFrame,
  maxDeltaTime = 1 / 20
}: AnimationFrameOptions) {
  const frameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      previousTimestampRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (previousTimestampRef.current === null) {
        previousTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - previousTimestampRef.current) / 1000,
        maxDeltaTime
      );

      previousTimestampRef.current = timestamp;
      elapsedTimeRef.current += deltaSeconds;
      onFrameRef.current(deltaSeconds, elapsedTimeRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning, maxDeltaTime]);

  const reset = useCallback(() => {
    elapsedTimeRef.current = 0;
    previousTimestampRef.current = null;
  }, []);

  return { reset };
}
