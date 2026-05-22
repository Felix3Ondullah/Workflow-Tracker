const API_BASE_URL = "http://127.0.0.1:8000/api/applications/";

async function request(path = "", options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const applicationTypes = [
  "Recordation",
  "Renewal",
  "Change of Ownership",
  "Change of Name",
  "Discontinuation",
];

export const reviewerDecisions = ["Approved", "Need More Information", "Rejected"];

export function listApplications() {
  return request();
}

export function getApplication(applicationId) {
  return request(`${applicationId}`);
}

export function createApplication(payload) {
  return request("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateApplication(applicationId, payload) {
  return request(`${applicationId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function submitApplication(applicationId) {
  return request(`${applicationId}/submit`, { method: "POST" });
}

export function startReview(applicationId) {
  return request(`${applicationId}/start-review`, { method: "POST" });
}

export function recordDecision(applicationId, payload) {
  return request(`${applicationId}/decision`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
