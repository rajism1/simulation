import type { ReactNode } from "react";

type SimulationShellProps = {
  header: ReactNode;
  canvas: ReactNode;
  controls: ReactNode;
  formulas?: ReactNode;
  graphs?: ReactNode;
  summary?: ReactNode;
};

export function SimulationShell({
  header,
  canvas,
  controls,
  formulas,
  graphs,
  summary
}: SimulationShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      {header}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_380px]">
        <div className="grid gap-6">
          {canvas}
          {summary}
          {formulas}
          {graphs}
        </div>
        <div>{controls}</div>
      </div>
    </main>
  );
}
