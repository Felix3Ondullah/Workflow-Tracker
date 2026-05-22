import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listApplications } from "../api";
import { StatusBadge } from "../components/StatusBadge";

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
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Application Overview</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Track every workflow step in one place</h1>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-3 font-semibold text-foam transition hover:bg-emerald-950"
          to="/applications/new"
        >
          Create Draft
        </Link>
      </div>

      {error ? <p className="rounded-2xl bg-rose-100 px-4 py-3 text-rose-800">{error}</p> : null}

      <div className="overflow-x-auto rounded-[28px] border border-ink/10 bg-white/90 shadow-panel">
        {loading ? (
          <p className="p-6 text-ink/70">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="p-6 text-ink/70">No applications yet. Create a draft to get started.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-ink/[0.03]">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Tracking Number</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Applicant</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Company</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Type</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Created</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink/70">Open</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-t border-ink/10">
                  <td className="px-4 py-4">
                    <Link className="font-semibold text-emerald-800 hover:text-emerald-950" to={`/applications/${application.id}`}>
                      {application.tracking_number}
                    </Link>
                  </td>
                  <td className="px-4 py-4">{application.applicant_name}</td>
                  <td className="px-4 py-4">{application.company_name}</td>
                  <td className="px-4 py-4">{application.application_type}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-4 py-4 text-ink/70">{new Date(application.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <Link
                      aria-label={`Open ${application.tracking_number}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                      to={`/applications/${application.id}`}
                      title="Open application"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
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
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
