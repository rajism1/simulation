import Link from "next/link";

const simulations = [
  {
    href: "/projectile-motion",
    title: "Projectile Motion",
    description: "Kinematics, trajectory analysis, range, height, and live motion graphs.",
    accent: "from-sky-500/20 via-cyan-400/10 to-transparent"
  },
  {
    href: "/shm",
    title: "Simple Harmonic Motion",
    description: "Mass-spring oscillation with damping, phase, displacement, and energy graphs.",
    accent: "from-emerald-500/20 via-teal-400/10 to-transparent"
  },
  {
    href: "/pendulum-motion",
    title: "Pendulum Motion",
    description: "Angular oscillation with gravity, length, damping, and energy analysis.",
    accent: "from-violet-500/20 via-fuchsia-400/10 to-transparent"
  },
  {
    href: "/convex-lens",
    title: "Convex Lens",
    description: "Ray tracing, focal length, image formation, and real versus virtual image behavior.",
    accent: "from-amber-500/20 via-orange-400/10 to-transparent"
  },
  {
    href: "/electric-field",
    title: "Electric Field",
    description: "Multiple charges, field lines, vector sampling, and draggable charge layouts.",
    accent: "from-rose-500/20 via-red-400/10 to-transparent"
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-panel backdrop-blur">
        <div className="text-xs uppercase tracking-[0.3em] text-sky-600">NCERT Physics Platform</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Simulation Library
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          The platform now includes multiple simulations on top of the shared framework. Use the
          library below to open each experience while the templates evolve organically through real
          implementation work.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {simulations.map((simulation) => (
          <Link
            className="group rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-panel backdrop-blur transition hover:-translate-y-1 hover:bg-white"
            href={simulation.href}
            key={simulation.href}
          >
            <div className={`rounded-2xl bg-gradient-to-br ${simulation.accent} p-5`}>
              <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Open Simulation</div>
              <div className="mt-3 text-2xl font-semibold text-slate-950">{simulation.title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{simulation.description}</p>
            </div>
            <div className="mt-5 text-sm font-semibold text-sky-600 transition group-hover:text-sky-700">
              Launch
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
