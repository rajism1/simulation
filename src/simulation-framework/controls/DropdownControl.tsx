import type { ParameterOption } from "@/types/simulation";

import { ControlField } from "./ControlField";

type DropdownControlProps = {
  label: string;
  value: string;
  options: ParameterOption[];
  description?: string;
  onChange: (value: string) => void;
};

export function DropdownControl({
  label,
  value,
  options,
  description,
  onChange
}: DropdownControlProps) {
  return (
    <ControlField label={label} description={description} valueLabel={value}>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </ControlField>
  );
}
