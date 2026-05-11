import type { ElectricityTemplateConfig } from "./types";

export const electricityTemplateExample: ElectricityTemplateConfig<{
  chargeStrength: number;
  chargeCount: number;
  showFieldLines: boolean;
}> = {
  id: "electricity-template",
  title: "Electricity Template",
  description: "Reusable foundation for charge visualization, field-line rendering, and voltage overlays.",
  fieldMode: "lines",
  supportsChargePlacement: true,
  defaultValues: {
    chargeStrength: 5,
    chargeCount: 2,
    showFieldLines: true
  },
  parameters: [
    { id: "chargeStrength", label: "Charge Strength", type: "slider", min: 1, max: 10, step: 0.5, defaultValue: 5 },
    { id: "chargeCount", label: "Charge Count", type: "numeric", min: 1, max: 8, step: 1, defaultValue: 2 },
    { id: "showFieldLines", label: "Field Lines", type: "toggle", defaultValue: true }
  ],
  formulas: [
    {
      id: "coulomb-law",
      title: "Coulomb's Law",
      latex: "F = k\\frac{q_1 q_2}{r^2}",
      mode: "block"
    }
  ],
  graphs: []
};
