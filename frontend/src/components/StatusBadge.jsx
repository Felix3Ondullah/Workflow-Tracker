export function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-200 text-slate-700",
    Submitted: "bg-sky-100 text-sky-800",
    "Under Review": "bg-amber-100 text-amber-800",
    "Need More Information": "bg-orange-100 text-orange-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-rose-100 text-rose-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
