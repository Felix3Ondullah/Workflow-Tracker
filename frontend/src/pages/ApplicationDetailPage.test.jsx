import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import { getApplication } from "../api";
import { ApplicationDetailPage } from "./ApplicationDetailPage";

vi.mock("../api", () => ({
  getApplication: vi.fn(),
  recordDecision: vi.fn(),
  reviewerDecisions: ["Approved", "Need More Information", "Rejected"],
  startReview: vi.fn(),
  submitApplication: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/applications/1"]}>
      <Routes>
        <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ApplicationDetailPage", () => {
  it("shows edit and submit actions for a draft application", async () => {
    getApplication.mockResolvedValue({
      id: 1,
      tracking_number: "APP-123",
      applicant_name: "Jane Doe",
      applicant_email: "jane@example.com",
      company_name: "Acme Corp",
      application_type: "Recordation",
      description: "Draft description",
      status: "Draft",
      reviewer_comment: "",
      created_at: "2026-05-22T10:00:00Z",
      updated_at: "2026-05-22T10:00:00Z",
      submitted_at: null,
      reviewed_at: null,
    });

    renderPage();

    expect(await screen.findByText("APP-123")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Application" })).toBeInTheDocument();
  });

  it("shows the reviewer decision form for an under review application", async () => {
    getApplication.mockResolvedValue({
      id: 1,
      tracking_number: "APP-999",
      applicant_name: "Jane Doe",
      applicant_email: "jane@example.com",
      company_name: "Acme Corp",
      application_type: "Recordation",
      description: "Under review description",
      status: "Under Review",
      reviewer_comment: "",
      created_at: "2026-05-22T10:00:00Z",
      updated_at: "2026-05-22T10:00:00Z",
      submitted_at: "2026-05-22T10:00:00Z",
      reviewed_at: null,
    });

    renderPage();

    expect(await screen.findByText("APP-999")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reviewer Decision" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Decision" })).toBeInTheDocument();
  });
});
