import {
  sampleFieldGrid,
  totalCharge,
  traceFieldLine,
  type Charge
} from "@/core/field-engine";
import { roundTo } from "@/core/math-engine";

import type {
  ElectricCharge,
  ElectricFieldAnalytics,
  ElectricFieldPreset,
  ElectricFieldSnapshot
} from "./types";

export const ELECTRIC_VIEWBOX = {
  width: 1000,
  height: 560
};

export const FIELD_BOUNDS = {
  minX: 80,
  maxX: 920,
  minY: 90,
  maxY: 470
};

export const ELECTRIC_FIELD_PRESETS: ElectricFieldPreset[] = [
  {
    id: "dipole",
    label: "Dipole",
    charges: [
      { id: "c1", x: 380, y: 280, magnitude: 2200 },
      { id: "c2", x: 620, y: 280, magnitude: -2200 }
    ]
  },
  {
    id: "like-charges",
    label: "Like Charges",
    charges: [
      { id: "c1", x: 410, y: 260, magnitude: 2000 },
      { id: "c2", x: 590, y: 300, magnitude: 2000 }
    ]
  },
  {
    id: "triangle",
    label: "Mixed Triangle",
    charges: [
      { id: "c1", x: 420, y: 360, magnitude: 1800 },
      { id: "c2", x: 590, y: 340, magnitude: -2400 },
      { id: "c3", x: 510, y: 170, magnitude: 1400 }
    ]
  }
];

export function getPresetCharges(presetId: string): ElectricCharge[] {
  return (
    ELECTRIC_FIELD_PRESETS.find((preset) => preset.id === presetId)?.charges ??
    ELECTRIC_FIELD_PRESETS[0].charges
  ).map((charge) => ({ ...charge }));
}

export function createElectricFieldSnapshot(charges: Charge[]): ElectricFieldSnapshot {
  const grid = sampleFieldGrid(charges, FIELD_BOUNDS, 90);

  return {
    charges,
    grid
  };
}

export function createElectricFieldAnalytics(snapshot: ElectricFieldSnapshot): ElectricFieldAnalytics {
  return {
    totalCharge: totalCharge(snapshot.charges),
    strongestField: roundTo(Math.max(...snapshot.grid.map((sample) => sample.strength), 0), 3),
    highestPotential: roundTo(
      Math.max(...snapshot.grid.map((sample) => Math.abs(sample.potential)), 0),
      3
    ),
    chargeCount: snapshot.charges.length
  };
}

export function createFieldLines(charges: Charge[]) {
  return charges.flatMap((charge) => {
    const offsets = [
      { x: 0, y: -20 },
      { x: 17, y: -11 },
      { x: 17, y: 11 },
      { x: 0, y: 20 },
      { x: -17, y: 11 },
      { x: -17, y: -11 }
    ];

    return offsets.map((offset, index) => {
      const start = {
        x: charge.x + offset.x,
        y: charge.y + offset.y
      };

      return {
        id: `${charge.id}-${index}`,
        points: traceFieldLine(charges, start, charge.magnitude >= 0 ? 1 : -1)
      };
    });
  });
}
