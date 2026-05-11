import { createStore } from "zustand/vanilla";

import type { ParameterValues } from "@/types/simulation";

export type ParameterStoreState<TParams extends ParameterValues> = {
  defaults: TParams;
  values: TParams;
  setParameter: <K extends keyof TParams>(key: K, value: TParams[K]) => void;
  setMany: (patch: Partial<TParams>) => void;
  reset: () => void;
};

export const createParameterStore = <TParams extends ParameterValues>(defaults: TParams) =>
  createStore<ParameterStoreState<TParams>>((set) => ({
    defaults,
    values: defaults,
    setParameter: (key, value) =>
      set((state) => ({
        values: {
          ...state.values,
          [key]: value
        }
      })),
    setMany: (patch) =>
      set((state) => ({
        values: {
          ...state.values,
          ...patch
        }
      })),
    reset: () =>
      set((state) => ({
        values: state.defaults
      }))
  }));
