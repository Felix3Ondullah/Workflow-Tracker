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
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            {mode === "create" ? "New Draft" : "Edit Draft"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {mode === "create" ? "Create application" : "Update application"}
          </h1>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-ink/15 bg-white/70 px-5 py-3 font-medium text-ink transition hover:bg-white"
          to="/"
        >
          Back to list
        </Link>
      </div>

      {error ? <p className="rounded-2xl bg-rose-100 px-4 py-3 text-rose-800">{error}</p> : null}
      {loading ? (
        <div className="rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel">
          <p className="text-ink/70">Loading application...</p>
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
