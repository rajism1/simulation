type SimulationHeaderProps = {
  title: string;
  description: string;
};

export function SimulationHeader({ title, description }: SimulationHeaderProps) {
  return (
    <header className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-panel backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-sky-600">Simulation Architecture</div>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
    </header>
  );
}
