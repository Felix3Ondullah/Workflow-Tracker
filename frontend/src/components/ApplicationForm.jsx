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
    <form className="card form-grid" onSubmit={onSubmit}>
      <label>
        <span>Applicant Name</span>
        <input name="applicant_name" value={form.applicant_name} onChange={onChange} required />
      </label>

      <label>
        <span>Applicant Email</span>
        <input name="applicant_email" type="email" value={form.applicant_email} onChange={onChange} required />
      </label>

      <label>
        <span>Company Name</span>
        <input name="company_name" value={form.company_name} onChange={onChange} required />
      </label>

      <label>
        <span>Application Type</span>
        <select name="application_type" value={form.application_type} onChange={onChange} required>
          {applicationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="full-width">
        <span>Description</span>
        <textarea name="description" rows="6" value={form.description} onChange={onChange} required />
      </label>

      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
