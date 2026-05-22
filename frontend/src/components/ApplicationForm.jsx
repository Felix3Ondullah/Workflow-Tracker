import { applicationTypes } from "../api";

const emptyForm = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: applicationTypes[0],
  description: "",
};

export function buildInitialForm(application) {
  if (!application) {
    return emptyForm;
  }

  return {
    applicant_name: application.applicant_name,
    applicant_email: application.applicant_email,
    company_name: application.company_name,
    application_type: application.application_type,
    description: application.description,
  };
}

export function ApplicationForm({ form, onChange, onSubmit, busy, submitLabel }) {
  return (
    <form
      className="grid gap-6 rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Applicant Name</span>
        <input
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-emerald-500"
          name="applicant_name"
          value={form.applicant_name}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Applicant Email</span>
        <input
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-emerald-500"
          name="applicant_email"
          type="email"
          value={form.applicant_email}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Company Name</span>
        <input
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-emerald-500"
          name="company_name"
          value={form.company_name}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Application Type</span>
        <select
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          name="application_type"
          value={form.application_type}
          onChange={onChange}
          required
        >
          {applicationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-semibold text-ink">Description</span>
        <textarea
          className="w-full rounded-3xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-emerald-500"
          name="description"
          rows="6"
          value={form.description}
          onChange={onChange}
          required
        />
      </label>

      <button
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-3 font-semibold text-foam transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={busy}
      >
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
