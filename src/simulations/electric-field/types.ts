import type { Charge, FieldSample } from "@/core/field-engine";

export type ElectricFieldParameters = {
  showFieldLines: boolean;
  showVectors: boolean;
  selectedPreset: string;
};

export type ElectricCharge = Charge;

export type ElectricFieldAnalytics = {
  totalCharge: number;
  strongestField: number;
  highestPotential: number;
  chargeCount: number;
};

export type ElectricFieldPreset = {
  id: string;
  label: string;
  charges: ElectricCharge[];
};

export type ElectricFieldSnapshot = {
  charges: ElectricCharge[];
  grid: FieldSample[];
};
