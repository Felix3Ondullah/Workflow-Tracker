import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createApplication, getApplication, updateApplication } from "../api";
import { ApplicationForm, buildInitialForm } from "../components/ApplicationForm";

export function ApplicationFormPage({ mode }) {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(buildInitialForm());
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") {
      return undefined;
    }

    async function loadApplication() {
      try {
        const application = await getApplication(applicationId);
        setForm(buildInitialForm(application));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
    return undefined;
  }, [applicationId, mode]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const application =
        mode === "create"
          ? await createApplication(form)
          : await updateApplication(applicationId, form);
      navigate(`/applications/${application.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{mode === "create" ? "New Draft" : "Edit Draft"}</p>
          <h1>{mode === "create" ? "Create application" : "Update application"}</h1>
        </div>
        <Link className="ghost-link" to="/">
          Back to list
        </Link>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? (
        <div className="card">
          <p>Loading application...</p>
        </div>
      ) : (
        <ApplicationForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          busy={saving}
          submitLabel={mode === "create" ? "Save Draft" : "Update Draft"}
        />
      )}
    </section>
  );
}
