import { reviewerDecisions } from "../api";

export function ReviewerDecisionForm({ value, onChange, onSubmit, busy }) {
  const commentRequired = value.decision === "Need More Information" || value.decision === "Rejected";

  return (
    <form className="card decision-form" onSubmit={onSubmit}>
      <h3>Reviewer Decision</h3>

      <label>
        <span>Decision</span>
        <select name="decision" value={value.decision} onChange={onChange}>
          {reviewerDecisions.map((decision) => (
            <option key={decision} value={decision}>
              {decision}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Comment</span>
        <textarea
          name="comment"
          rows="4"
          value={value.comment}
          onChange={onChange}
          required={commentRequired}
          placeholder={commentRequired ? "This decision requires a comment." : "Optional comment"}
        />
      </label>

      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? "Submitting..." : "Save Decision"}
      </button>
    </form>
  );
}
