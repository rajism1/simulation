import type { ElectricityTemplateConfig } from "@/templates/electricity-template";

import { ELECTRIC_FIELD_PRESETS } from "./physics";
import type { ElectricFieldParameters } from "./types";

export const electricFieldBaseConfig: ElectricityTemplateConfig<ElectricFieldParameters> = {
  id: "electric-field",
  title: "Electric Field Visualization",
  description:
    "Visualize how positive and negative charges create field lines, vector directions, and changing electric potential across space.",
  fieldMode: "lines",
  supportsChargePlacement: true,
  defaultValues: {
    showFieldLines: true,
    showVectors: true,
    selectedPreset: "dipole"
  },
  parameters: [
    {
      id: "selectedPreset",
      label: "Charge Arrangement",
      type: "dropdown",
      defaultValue: "dipole",
      options: ELECTRIC_FIELD_PRESETS.map((preset) => ({
        label: preset.label,
        value: preset.id
      }))
    },
    {
      id: "showFieldLines",
      label: "Field Lines",
      type: "toggle",
      defaultValue: true
    },
    {
      id: "showVectors",
      label: "Field Vectors",
      type: "toggle",
      defaultValue: true
    }
  ],
  formulas: [
    {
      id: "coulomb-law",
      title: "Electric Field",
      latex: "\\vec{E} = k\\frac{q}{r^2}\\hat{r}",
      description: "The electric field around a point charge depends on charge magnitude and falls with the square of distance.",
      mode: "block"
    },
    {
      id: "electric-potential",
      title: "Electric Potential",
      latex: "V = k\\frac{q}{r}",
      description: "Potential accumulates from all charges and changes sign with charge polarity.",
      mode: "block"
    }
  ],
  graphs: []
};
