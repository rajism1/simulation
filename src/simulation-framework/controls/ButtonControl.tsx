type ButtonControlProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

const classesByVariant = {
  primary: "bg-sky-500 text-white hover:bg-sky-600",
  secondary: "bg-slate-900 text-white hover:bg-slate-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
};

export function ButtonControl({
  label,
  onClick,
  variant = "primary"
}: ButtonControlProps) {
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${classesByVariant[variant]}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
