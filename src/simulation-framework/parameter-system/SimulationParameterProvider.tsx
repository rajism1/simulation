"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";

import {
  createParameterStore,
  type ParameterStoreState
} from "@/simulation-framework/parameter-system/createParameterStore";
import type { ParameterValues } from "@/types/simulation";

const SimulationParameterContext = createContext<StoreApi<ParameterStoreState<ParameterValues>> | null>(
  null
);

type SimulationParameterProviderProps<TParams extends ParameterValues> = {
  children: ReactNode;
  defaults: TParams;
};

export function SimulationParameterProvider<TParams extends ParameterValues>({
  children,
  defaults
}: SimulationParameterProviderProps<TParams>) {
  const storeRef = useRef<StoreApi<ParameterStoreState<TParams>> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createParameterStore(defaults);
  }

  return (
    <SimulationParameterContext.Provider
      value={storeRef.current as unknown as StoreApi<ParameterStoreState<ParameterValues>>}
    >
      {children}
    </SimulationParameterContext.Provider>
  );
}

export const useSimulationParameterStore = <TResult,>(
  selector: (state: ParameterStoreState<ParameterValues>) => TResult
) => {
  const store = useContext(SimulationParameterContext);

  if (!store) {
    throw new Error("useSimulationParameterStore must be used inside SimulationParameterProvider");
  }

  return useStore(store, selector);
};
