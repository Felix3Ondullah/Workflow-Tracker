import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getApplication, recordDecision, startReview, submitApplication } from "../api";
import { ReviewerDecisionForm } from "../components/ReviewerDecisionForm";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryAction, Surface } from "../components/ui";

const decisionInitialState = {
  decision: "Approved",
  comment: "",
};

function DetailItem({ label, value }) {
  return (
    <p className="grid gap-1">
      <strong className="text-[12px] font-medium text-slate-400">{label}</strong>
      <span className="text-sm text-slate-700">{value}</span>
    </p>
  );
}

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
    return <Surface className="px-5 py-8 text-sm text-slate-500">Loading application...</Surface>;
  }

  if (!application) {
    return <Surface className="px-5 py-8 text-sm text-slate-500">Application not found.</Surface>;
  }

  const canEdit = application.status === "Draft" || application.status === "Need More Information";
  const canSubmit = canEdit;
  const canStartReview = application.status === "Submitted";
  const canDecide = application.status === "Under Review";

  return (
    <section className="grid gap-5">
      <Surface className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-700">Application Detail</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">{application.tracking_number}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrimaryAction as={Link} className="bg-slate-800 hover:bg-slate-900" to="/">
            Back to list
          </PrimaryAction>
          {canEdit ? (
            <PrimaryAction as="button" className="bg-slate-800 hover:bg-slate-900" onClick={() => navigate(`/applications/${application.id}/edit`)}>
              Edit Application
            </PrimaryAction>
          ) : null}
          {canSubmit ? (
            <PrimaryAction as="button" disabled={working} onClick={() => runAction(() => submitApplication(application.id))}>
              {application.status === "Draft" ? "Submit Application" : "Resubmit Application"}
            </PrimaryAction>
          ) : null}
          {canStartReview ? (
            <PrimaryAction as="button" disabled={working} onClick={() => runAction(() => startReview(application.id))}>
              Start Review
            </PrimaryAction>
          ) : null}
        </div>
      </Surface>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Surface className="grid gap-6 px-5 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Application Information</h2>
            <StatusBadge status={application.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label="Applicant" value={application.applicant_name} />
            <DetailItem label="Email" value={application.applicant_email} />
            <DetailItem label="Company" value={application.company_name} />
            <DetailItem label="Type" value={application.application_type} />
            <DetailItem label="Created" value={new Date(application.created_at).toLocaleString()} />
            <DetailItem
              label="Submitted"
              value={application.submitted_at ? new Date(application.submitted_at).toLocaleString() : "Not submitted yet"}
            />
            <DetailItem
              label="Reviewed"
              value={application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : "Not reviewed yet"}
            />
          </div>

          <div className="grid gap-2">
            <strong className="text-[12px] font-medium text-slate-400">Description</strong>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{application.description}</p>
          </div>

          <div className="grid gap-2">
            <strong className="text-[12px] font-medium text-slate-400">Reviewer Comment</strong>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{application.reviewer_comment || "No reviewer comment yet."}</p>
          </div>
        </Surface>

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
