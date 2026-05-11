import { ControlField } from "./ControlField";

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  description?: string;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
};

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 0.1,
  description,
  formatValue,
  onChange
}: SliderControlProps) {
  return (
    <ControlField
      label={label}
      description={description}
      valueLabel={formatValue ? formatValue(value) : value.toString()}
    >
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-500"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </ControlField>
  );
}
