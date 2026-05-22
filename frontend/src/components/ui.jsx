export function PrimaryAction({ as: Component = "button", className = "", children, ...props }) {
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Surface({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>;
}
