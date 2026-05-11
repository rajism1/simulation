import { ControlField } from "./ControlField";

type NumericInputControlProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  onChange: (value: number) => void;
};

export function NumericInputControl({
  label,
  value,
  min,
  max,
  step = 0.1,
  description,
  onChange
}: NumericInputControlProps) {
  return (
    <ControlField label={label} description={description} valueLabel={value.toString()}>
      <input
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="number"
        value={value}
      />
    </ControlField>
  );
}
