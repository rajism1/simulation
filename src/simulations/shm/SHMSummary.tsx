import type { SHMAnalytics } from "./types";

type SHMSummaryProps = {
  analytics: SHMAnalytics;
};

const cards = (analytics: SHMAnalytics) => [
  { label: "Displacement", value: `${analytics.displacement.toFixed(2)} px` },
  { label: "Velocity", value: `${analytics.velocity.toFixed(2)} px/s` },
  { label: "Acceleration", value: `${analytics.acceleration.toFixed(2)} px/s^2` },
  { label: "Kinetic Energy", value: `${analytics.kineticEnergy.toFixed(2)} J` },
  { label: "Potential Energy", value: `${analytics.potentialEnergy.toFixed(2)} J` },
  { label: "Period", value: `${analytics.period.toFixed(2)} s` }
];

export function SHMSummary({ analytics }: SHMSummaryProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards(analytics).map((card) => (
        <article
          className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-panel backdrop-blur"
          key={card.label}
        >
          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{card.label}</div>
          <div className="mt-3 text-2xl font-semibold text-slate-950">{card.value}</div>
        </article>
      ))}
    </section>
  );
}
