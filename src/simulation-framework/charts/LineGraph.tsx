"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { GraphDefinition } from "@/types/simulation";

type LineGraphProps = {
  graph: GraphDefinition;
};

export function LineGraph({ graph }: LineGraphProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-100 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-slate-900">{graph.title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graph.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe4f0" />
          <XAxis dataKey={graph.xAxisKey} stroke="#64748b" />
          <YAxis stroke="#64748b" label={graph.yAxisLabel ? { value: graph.yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip />
          <Legend />
          {graph.series.map((series) => (
            <Line
              dataKey={series.id}
              dot={false}
              key={series.id}
              name={series.label}
              stroke={series.color}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
