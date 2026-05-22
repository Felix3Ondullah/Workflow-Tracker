import { reviewerDecisions } from "../api";

export function ReviewerDecisionForm({ value, onChange, onSubmit, busy }) {
  const commentRequired = value.decision === "Need More Information" || value.decision === "Rejected";

  return (
    <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5" onSubmit={onSubmit}>
      <h3 className="text-lg font-semibold tracking-tight text-slate-800">Reviewer Decision</h3>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Decision</span>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500"
          name="decision"
          value={value.decision}
          onChange={onChange}
        >
          {reviewerDecisions.map((decision) => (
            <option key={decision} value={decision}>
              {decision}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-slate-600">Comment</span>
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-500"
          name="comment"
          rows="4"
          value={value.comment}
          onChange={onChange}
          required={commentRequired}
          placeholder={commentRequired ? "This decision requires a comment." : "Optional comment"}
        />
      </label>

      <button
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={busy}
      >
        {busy ? "Submitting..." : "Save Decision"}
      </button>
    </form>
  );
}
