import { ControlField } from "./ControlField";

type ToggleControlProps = {
  label: string;
  checked: boolean;
  description?: string;
  onChange: (checked: boolean) => void;
};

export function ToggleControl({ label, checked, description, onChange }: ToggleControlProps) {
  return (
    <ControlField label={label} description={description} valueLabel={checked ? "On" : "Off"}>
      <button
        className={`flex h-10 w-20 items-center rounded-full p-1 transition ${
          checked ? "bg-sky-500" : "bg-slate-300"
        }`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={`h-8 w-8 rounded-full bg-white shadow transition ${
            checked ? "translate-x-10" : "translate-x-0"
          }`}
        />
      </button>
    </ControlField>
  );
}
