import type { ElectricFieldAnalytics } from "./types";

type ElectricFieldSummaryProps = {
  analytics: ElectricFieldAnalytics;
};

export function ElectricFieldSummary({ analytics }: ElectricFieldSummaryProps) {
  const cards = [
    { label: "Total Charge", value: analytics.totalCharge.toString() },
    { label: "Strongest Field", value: analytics.strongestField.toString() },
    { label: "Highest Potential", value: analytics.highestPotential.toString() },
    { label: "Charge Count", value: analytics.chargeCount.toString() }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
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
