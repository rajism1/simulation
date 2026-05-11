import type { FormulaDefinition } from "@/types/simulation";

import { FormulaCard } from "./FormulaCard";

type FormulaPanelProps = {
  formulas: FormulaDefinition[];
};

export function FormulaPanel({ formulas }: FormulaPanelProps) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-panel backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Formula Panel</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">KaTeX</span>
      </div>
      <div className="mt-4 grid gap-4">
        {formulas.map((formula) => (
          <FormulaCard formula={formula} key={formula.id} />
        ))}
      </div>
    </section>
  );
}
