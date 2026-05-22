import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listApplications } from "../api";

const workflowGroups = [
  {
    title: "Draft",
    statuses: ["Draft"],
    dotClassName: "bg-slate-400",
    bandClassName: "bg-slate-100 text-slate-700",
  },
  {
    title: "Submitted",
    statuses: ["Submitted"],
    dotClassName: "bg-sky-500",
    bandClassName: "bg-sky-50 text-sky-700",
  },
  {
    title: "Under Review",
    statuses: ["Under Review"],
    dotClassName: "bg-amber-500",
    bandClassName: "bg-amber-50 text-amber-700",
  },
  {
    title: "Need More Information",
    statuses: ["Need More Information"],
    dotClassName: "bg-orange-500",
    bandClassName: "bg-orange-50 text-orange-700",
  },
  {
    title: "Approved",
    statuses: ["Approved"],
    dotClassName: "bg-emerald-500",
    bandClassName: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Rejected",
    statuses: ["Rejected"],
    dotClassName: "bg-rose-500",
    bandClassName: "bg-rose-50 text-rose-700",
  },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusChip(status) {
  const styles = {
    Draft: "border-slate-200 bg-slate-50 text-slate-600",
    Submitted: "border-sky-200 bg-sky-50 text-sky-700",
    "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
    "Need More Information": "border-orange-200 bg-orange-50 text-orange-700",
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${styles[status] ?? styles.Draft}`}>
      {status}
    </span>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td className="px-5 py-5 text-xs text-slate-400" colSpan={6}>
        No applications in this stage yet.
      </td>
    </tr>
  );
}

function GroupTable({ group, applications }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className={`flex items-center justify-between px-4 py-3 text-sm font-medium ${group.bandClassName}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${group.dotClassName}`} />
          <span>{group.title}</span>
          <span className="text-xs opacity-70">{applications.length}</span>
        </div>
        <span className="text-xs opacity-60">⌃</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-medium text-slate-400">
              <th className="px-5 py-3">Tracking No.</th>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Open</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? <EmptyRow /> : null}
            {applications.map((application) => (
              <tr
                key={application.id}
                className="group border-b border-slate-100 text-[13px] text-slate-600 transition last:border-b-0 hover:bg-slate-50/80"
              >
                <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-slate-500">{application.tracking_number}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                      {application.applicant_name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <Link
                        className="block truncate text-[13px] font-medium text-slate-800 transition group-hover:text-slate-950"
                        to={`/applications/${application.id}`}
                      >
                        {application.applicant_name}
                      </Link>
                      <p className="truncate text-[11px] text-slate-400">{application.applicant_email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-medium text-cyan-600">
                    {application.company_name}
                  </span>
                </td>
                <td className="px-5 py-4">{statusChip(application.application_type)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-[12px] text-slate-500">{formatDate(application.updated_at)}</td>
                <td className="px-5 py-4">
                  <Link
                    aria-label={`Open ${application.tracking_number}`}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    title="Open application"
                    to={`/applications/${application.id}`}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ApplicationListPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setApplications(await listApplications());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <section className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[13px] font-medium text-slate-700">Workflow Board</p>
            <p className="text-[11px] text-slate-400">Track applications by stage with a compact operations view.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-400">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="m21 21-4.35-4.35m1.85-5.15A7 7 0 1 1 4.5 11.5a7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>Search...</span>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span className="rounded-lg border border-slate-200 px-3 py-2">Group by</span>
            <span className="rounded-lg border border-slate-200 px-3 py-2">Filter</span>
            <Link className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-600" to="/applications/new">
              + Add Task
            </Link>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-sm text-slate-500">Loading applications...</div> : null}

      {!loading
        ? workflowGroups.map((group) => (
            <GroupTable
              key={group.title}
              applications={applications.filter((application) => group.statuses.includes(application.status))}
              group={group}
            />
          ))
        : null}
    </section>
  );
}
