import type { ReactNode } from "react";

type ControlFieldProps = {
  label: string;
  description?: string;
  valueLabel?: string;
  children: ReactNode;
};

export function ControlField({ label, description, valueLabel, children }: ControlFieldProps) {
  return (
    <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </div>
        {valueLabel ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {valueLabel}
          </span>
        ) : null}
      </div>
      {children}
    </label>
  );
}
