import katex from "katex";

import type { FormulaDefinition } from "@/types/simulation";

type FormulaCardProps = {
  formula: FormulaDefinition;
};

export function FormulaCard({ formula }: FormulaCardProps) {
  const html = katex.renderToString(formula.latex, {
    displayMode: formula.mode === "block",
    throwOnError: false
  });

  return (
    <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
      <div className="text-sm font-semibold text-slate-900">{formula.title}</div>
      <div
        className="mt-3 overflow-x-auto text-slate-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {formula.description ? <p className="mt-3 text-xs text-slate-600">{formula.description}</p> : null}
    </article>
  );
}
