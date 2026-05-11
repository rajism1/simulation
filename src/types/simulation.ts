import type { ReactNode } from "react";

export type SimulationStatus = "idle" | "running" | "paused";

export type ParameterValue = number | boolean | string;
export type ParameterValues = Record<string, ParameterValue>;

export type ParameterOption = {
  label: string;
  value: string;
};

type BaseParameterDefinition<TType extends string, TValue extends ParameterValue> = {
  id: string;
  label: string;
  type: TType;
  defaultValue: TValue;
  description?: string;
  group?: string;
};

export type SliderParameterDefinition = BaseParameterDefinition<"slider", number> & {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
};

export type ToggleParameterDefinition = BaseParameterDefinition<"toggle", boolean>;

export type DropdownParameterDefinition = BaseParameterDefinition<"dropdown", string> & {
  options: ParameterOption[];
};

export type NumericParameterDefinition = BaseParameterDefinition<"numeric", number> & {
  min?: number;
  max?: number;
  step?: number;
};

export type ButtonParameterDefinition = BaseParameterDefinition<"button", string> & {
  buttonText: string;
};

export type ParameterDefinition =
  | SliderParameterDefinition
  | ToggleParameterDefinition
  | DropdownParameterDefinition
  | NumericParameterDefinition
  | ButtonParameterDefinition;

export type FormulaDefinition = {
  id: string;
  title: string;
  latex: string;
  description?: string;
  mode?: "inline" | "block";
};

export type GraphPoint = {
  timestamp: number;
  [key: string]: number;
};

export type GraphSeriesDefinition = {
  id: string;
  label: string;
  color: string;
};

export type GraphDefinition = {
  id: string;
  title: string;
  xAxisKey: string;
  yAxisLabel?: string;
  data: GraphPoint[];
  series: GraphSeriesDefinition[];
};

export type SimulationControlAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export type SimulationCanvasBinding = {
  mountNode: HTMLDivElement;
  width: number;
  height: number;
};

export type ShellSectionRenderer = ReactNode;

export type SimulationScaffoldConfig<TParams extends ParameterValues> = {
  id: string;
  title: string;
  description: string;
  parameters: ParameterDefinition[];
  defaultValues: TParams;
  formulas?: FormulaDefinition[];
  graphs?: GraphDefinition[];
  summary?: ReactNode;
};
