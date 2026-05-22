import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listApplications } from "../api";
import { StatusBadge } from "../components/StatusBadge";

export function ApplicationListPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setApplications(await listApplications());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Application Overview</p>
          <h1>Track every workflow step in one place</h1>
        </div>
        <Link className="primary-button" to="/applications/new">
          Create Draft
        </Link>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="card table-card">
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications yet. Create a draft to get started.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Applicant</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <Link to={`/applications/${application.id}`}>{application.tracking_number}</Link>
                  </td>
                  <td>{application.applicant_name}</td>
                  <td>{application.company_name}</td>
                  <td>{application.application_type}</td>
                  <td>
                    <StatusBadge status={application.status} />
                  </td>
                  <td>{new Date(application.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
