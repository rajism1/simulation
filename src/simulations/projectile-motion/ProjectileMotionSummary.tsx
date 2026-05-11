import type { ProjectileAnalytics } from "./types";

type ProjectileMotionSummaryProps = {
  analytics: ProjectileAnalytics;
};

const cards = (analytics: ProjectileAnalytics) => [
  { label: "Current Height", value: `${analytics.currentY.toFixed(2)} m` },
  { label: "Current Speed", value: `${analytics.speed.toFixed(2)} m/s` },
  { label: "Max Height", value: `${analytics.maxHeight.toFixed(2)} m` },
  { label: "Range", value: `${analytics.range.toFixed(2)} m` },
  { label: "Flight Time", value: `${analytics.flightTime.toFixed(2)} s` },
  { label: "Time To Peak", value: `${analytics.timeToPeak.toFixed(2)} s` }
];

export function ProjectileMotionSummary({ analytics }: ProjectileMotionSummaryProps) {
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
