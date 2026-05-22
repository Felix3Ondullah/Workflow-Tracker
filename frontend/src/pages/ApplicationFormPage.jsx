import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createApplication, getApplication, updateApplication } from "../api";
import { ApplicationForm, buildInitialForm } from "../components/ApplicationForm";
import { PrimaryAction, Surface } from "../components/ui";

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
      <Surface className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-700">
            {mode === "create" ? "New Draft" : "Edit Draft"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            {mode === "create" ? "Create application" : "Update application"}
          </h1>
        </div>
        <PrimaryAction as={Link} className="bg-slate-800 hover:bg-slate-900" to="/">
          Back to list
        </PrimaryAction>
      </Surface>

      {error ? <p className="rounded-2xl bg-rose-100 px-4 py-3 text-rose-800">{error}</p> : null}
      {loading ? (
        <Surface className="px-5 py-8 text-sm text-slate-500">Loading application...</Surface>
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
