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
      <div className="card">
        <p>Loading application...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="card">
        <p>Application not found.</p>
      </div>
    );
  }

  const canEdit = application.status === "Draft" || application.status === "Need More Information";
  const canSubmit = canEdit;
  const canStartReview = application.status === "Submitted";
  const canDecide = application.status === "Under Review";

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Application Detail</p>
          <h1>{application.tracking_number}</h1>
        </div>
        <div className="action-row">
          <Link className="ghost-link" to="/">
            Back to list
          </Link>
          {canEdit ? (
            <button className="secondary-button" onClick={() => navigate(`/applications/${application.id}/edit`)}>
              Edit
            </button>
          ) : null}
          {canSubmit ? (
            <button className="primary-button" disabled={working} onClick={() => runAction(() => submitApplication(application.id))}>
              {application.status === "Draft" ? "Submit" : "Resubmit"}
            </button>
          ) : null}
          {canStartReview ? (
            <button className="primary-button" disabled={working} onClick={() => runAction(() => startReview(application.id))}>
              Start Review
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="detail-layout">
        <article className="card stack">
          <div className="detail-header">
            <h2>Application Information</h2>
            <StatusBadge status={application.status} />
          </div>

          <div className="detail-grid">
            <p>
              <strong>Applicant</strong>
              <span>{application.applicant_name}</span>
            </p>
            <p>
              <strong>Email</strong>
              <span>{application.applicant_email}</span>
            </p>
            <p>
              <strong>Company</strong>
              <span>{application.company_name}</span>
            </p>
            <p>
              <strong>Type</strong>
              <span>{application.application_type}</span>
            </p>
            <p>
              <strong>Created</strong>
              <span>{new Date(application.created_at).toLocaleString()}</span>
            </p>
            <p>
              <strong>Submitted</strong>
              <span>{application.submitted_at ? new Date(application.submitted_at).toLocaleString() : "Not submitted yet"}</span>
            </p>
            <p>
              <strong>Reviewed</strong>
              <span>{application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : "Not reviewed yet"}</span>
            </p>
          </div>

          <div>
            <strong>Description</strong>
            <p className="description">{application.description}</p>
          </div>

          <div>
            <strong>Reviewer Comment</strong>
            <p className="description">{application.reviewer_comment || "No reviewer comment yet."}</p>
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
