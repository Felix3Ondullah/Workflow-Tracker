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
      className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Applicant Name</span>
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
          name="applicant_name"
          value={form.applicant_name}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Applicant Email</span>
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
          name="applicant_email"
          type="email"
          value={form.applicant_email}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Company Name</span>
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
          name="company_name"
          value={form.company_name}
          onChange={onChange}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Application Type</span>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500"
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
        <span className="text-[12px] font-medium text-slate-600">Description</span>
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
          name="description"
          rows="6"
          value={form.description}
          onChange={onChange}
          required
        />
      </label>

      <button
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={busy}
      >
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
