import { reviewerDecisions } from "../api";

export function ReviewerDecisionForm({ value, onChange, onSubmit, busy }) {
  const commentRequired = value.decision === "Need More Information" || value.decision === "Rejected";

  return (
    <form className="grid gap-5 rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-panel" onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold tracking-tight text-ink">Reviewer Decision</h3>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">Decision</span>
        <select
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
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
        <span className="text-sm font-semibold text-ink">Comment</span>
        <textarea
          className="w-full rounded-3xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-emerald-500"
          name="comment"
          rows="4"
          value={value.comment}
          onChange={onChange}
          required={commentRequired}
          placeholder={commentRequired ? "This decision requires a comment." : "Optional comment"}
        />
      </label>

      <button
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-3 font-semibold text-foam transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={busy}
      >
        {busy ? "Submitting..." : "Save Decision"}
      </button>
    </form>
  );
}
