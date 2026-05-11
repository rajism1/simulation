"use client";

import { useSimulationParameterStore } from "./SimulationParameterProvider";

export const useSimulationParameters = () => {
  const values = useSimulationParameterStore((state) => state.values);
  const defaults = useSimulationParameterStore((state) => state.defaults);
  const setParameter = useSimulationParameterStore((state) => state.setParameter);
  const setMany = useSimulationParameterStore((state) => state.setMany);
  const reset = useSimulationParameterStore((state) => state.reset);

  return {
    values,
    defaults,
    setParameter,
    setMany,
    reset
  };
};
