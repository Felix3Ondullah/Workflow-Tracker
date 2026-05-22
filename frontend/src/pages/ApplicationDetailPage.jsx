import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getApplication, recordDecision, startReview, submitApplication } from "../api";
import { ReviewerDecisionForm } from "../components/ReviewerDecisionForm";
import { StatusBadge } from "../components/StatusBadge";

const decisionInitialState = {
  decision: "Approved",
  comment: "",
};

export function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [decisionForm, setDecisionForm] = useState(decisionInitialState);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        setApplication(await getApplication(applicationId));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  async function runAction(action) {
    setWorking(true);
    setError("");
    try {
      const updatedApplication = await action();
      setApplication(updatedApplication);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  function handleDecisionChange(event) {
    const { name, value } = event.target;
    setDecisionForm((current) => ({ ...current, [name]: value }));
  }

  async function handleDecisionSubmit(event) {
    event.preventDefault();
    await runAction(() => recordDecision(applicationId, decisionForm));
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel">
        <p className="text-ink/70">Loading application...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel">
        <p className="text-ink/70">Application not found.</p>
      </div>
    );
  }

  const canEdit = application.status === "Draft" || application.status === "Need More Information";
  const canSubmit = canEdit;
  const canStartReview = application.status === "Submitted";
  const canDecide = application.status === "Under Review";

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Application Detail</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{application.tracking_number}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-ink/15 bg-white/70 px-5 py-3 font-medium text-ink transition hover:bg-white"
            to="/"
          >
            Back to list
          </Link>
          {canEdit ? (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-mint px-5 py-3 font-semibold text-ink transition hover:bg-emerald-200"
              onClick={() => navigate(`/applications/${application.id}/edit`)}
            >
              Edit
            </button>
          ) : null}
          {canSubmit ? (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-3 font-semibold text-foam transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={working}
              onClick={() => runAction(() => submitApplication(application.id))}
            >
              {application.status === "Draft" ? "Submit" : "Resubmit"}
            </button>
          ) : null}
          {canStartReview ? (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-3 font-semibold text-foam transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={working}
              onClick={() => runAction(() => startReview(application.id))}
            >
              Start Review
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-rose-100 px-4 py-3 text-rose-800">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <article className="grid gap-6 rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Application Information</h2>
            <StatusBadge status={application.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Applicant</strong>
              <span>{application.applicant_name}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Email</strong>
              <span>{application.applicant_email}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Company</strong>
              <span>{application.company_name}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Type</strong>
              <span>{application.application_type}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Created</strong>
              <span>{new Date(application.created_at).toLocaleString()}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Submitted</strong>
              <span>{application.submitted_at ? new Date(application.submitted_at).toLocaleString() : "Not submitted yet"}</span>
            </p>
            <p className="grid gap-1">
              <strong className="text-sm font-semibold text-ink/70">Reviewed</strong>
              <span>{application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : "Not reviewed yet"}</span>
            </p>
          </div>

          <div className="grid gap-2">
            <strong className="text-sm font-semibold text-ink/70">Description</strong>
            <p className="whitespace-pre-wrap text-ink/90">{application.description}</p>
          </div>

          <div className="grid gap-2">
            <strong className="text-sm font-semibold text-ink/70">Reviewer Comment</strong>
            <p className="whitespace-pre-wrap text-ink/90">{application.reviewer_comment || "No reviewer comment yet."}</p>
          </div>
        </article>

        {canDecide ? (
          <ReviewerDecisionForm
            value={decisionForm}
            onChange={handleDecisionChange}
            onSubmit={handleDecisionSubmit}
            busy={working}
          />
        ) : null}
      </div>
    </section>
  );
}
