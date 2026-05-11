import type { PendulumAnalytics } from "./types";

type PendulumSummaryProps = {
  analytics: PendulumAnalytics;
};

const cards = (analytics: PendulumAnalytics) => [
  { label: "Angle", value: `${analytics.angleDegrees.toFixed(2)} deg` },
  { label: "Angular Velocity", value: `${analytics.angularVelocity.toFixed(3)} rad/s` },
  { label: "Angular Acceleration", value: `${analytics.angularAcceleration.toFixed(3)} rad/s^2` },
  { label: "Kinetic Energy", value: `${analytics.kineticEnergy.toFixed(2)} J` },
  { label: "Potential Energy", value: `${analytics.potentialEnergy.toFixed(2)} J` },
  { label: "Period", value: `${analytics.period.toFixed(2)} s` }
];

export function PendulumSummary({ analytics }: PendulumSummaryProps) {
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
