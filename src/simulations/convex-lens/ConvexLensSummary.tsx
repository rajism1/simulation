import type { ConvexLensAnalytics } from "./types";

type ConvexLensSummaryProps = {
  analytics: ConvexLensAnalytics;
};

export function ConvexLensSummary({ analytics }: ConvexLensSummaryProps) {
  const cards = [
    {
      label: "Image Distance",
      value: analytics.atFocus ? "Infinity" : `${analytics.imageDistance} cm`
    },
    {
      label: "Magnification",
      value: analytics.atFocus ? "Infinity" : analytics.magnification.toString()
    },
    {
      label: "Image Height",
      value: analytics.atFocus ? "Infinity" : `${analytics.imageHeight} px`
    },
    {
      label: "Image Nature",
      value: analytics.atFocus ? "At Infinity" : analytics.imageNature
    },
    {
      label: "Orientation",
      value: analytics.orientation
    },
    {
      label: "Focus Match",
      value: Math.abs(analytics.objectDistance - analytics.focalLength) < 0.001 ? "At focus" : "Off focus"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
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
