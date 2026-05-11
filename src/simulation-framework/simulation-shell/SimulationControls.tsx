"use client";

import {
  ButtonControl,
  DropdownControl,
  NumericInputControl,
  SliderControl,
  ToggleControl
} from "@/simulation-framework/controls";
import { useSimulationParameters } from "@/simulation-framework/parameter-system";
import type { ParameterDefinition, SimulationControlAction } from "@/types/simulation";

type SimulationControlsProps = {
  parameters: ParameterDefinition[];
  actions?: SimulationControlAction[];
};

export function SimulationControls({ parameters, actions = [] }: SimulationControlsProps) {
  const { values, setParameter } = useSimulationParameters();

  return (
    <aside className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-panel backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Controls</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Config Driven</span>
      </div>
      <div className="mt-4 grid gap-4">
        {parameters.map((parameter) => {
          const value = values[parameter.id];

          switch (parameter.type) {
            case "slider":
              return (
                <SliderControl
                  description={parameter.description}
                  formatValue={parameter.formatValue}
                  key={parameter.id}
                  label={parameter.label}
                  max={parameter.max}
                  min={parameter.min}
                  onChange={(nextValue) => setParameter(parameter.id, nextValue)}
                  step={parameter.step}
                  value={Number(value)}
                />
              );
            case "toggle":
              return (
                <ToggleControl
                  checked={Boolean(value)}
                  description={parameter.description}
                  key={parameter.id}
                  label={parameter.label}
                  onChange={(nextValue) => setParameter(parameter.id, nextValue)}
                />
              );
            case "dropdown":
              return (
                <DropdownControl
                  description={parameter.description}
                  key={parameter.id}
                  label={parameter.label}
                  onChange={(nextValue) => setParameter(parameter.id, nextValue)}
                  options={parameter.options}
                  value={String(value)}
                />
              );
            case "numeric":
              return (
                <NumericInputControl
                  description={parameter.description}
                  key={parameter.id}
                  label={parameter.label}
                  max={parameter.max}
                  min={parameter.min}
                  onChange={(nextValue) => setParameter(parameter.id, nextValue)}
                  step={parameter.step}
                  value={Number(value)}
                />
              );
            case "button":
              return (
                <ButtonControl
                  key={parameter.id}
                  label={parameter.buttonText}
                  onClick={() => setParameter(parameter.id, parameter.defaultValue)}
                  variant="secondary"
                />
              );
            default:
              return null;
          }
        })}
      </div>
      {actions.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
          {actions.map((action) => (
            <ButtonControl
              key={action.label}
              label={action.label}
              onClick={action.onClick}
              variant={action.variant}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}
