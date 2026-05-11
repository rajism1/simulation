import type { GraphDefinition } from "@/types/simulation";

import { LineGraph } from "./LineGraph";

type GraphPanelProps = {
  graphs: GraphDefinition[];
};

export function GraphPanel({ graphs }: GraphPanelProps) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-panel backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Graph Panel</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Recharts</span>
      </div>
      <div className="mt-4 grid gap-4">
        {graphs.map((graph) => (
          <LineGraph graph={graph} key={graph.id} />
        ))}
      </div>
    </section>
  );
}
