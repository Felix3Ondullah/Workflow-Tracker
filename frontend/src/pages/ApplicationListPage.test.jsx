import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { listApplications } from "../api";
import { ApplicationListPage } from "./ApplicationListPage";

vi.mock("../api", () => ({
  listApplications: vi.fn(),
}));

describe("ApplicationListPage", () => {
  it("loads applications into workflow groups and toggles a section closed", async () => {
    listApplications.mockResolvedValue([
      {
        id: 1,
        tracking_number: "APP-123",
        applicant_name: "Jane Doe",
        applicant_email: "jane@example.com",
        company_name: "Acme Corp",
        application_type: "Recordation",
        status: "Draft",
        updated_at: "2026-05-22T10:00:00Z",
      },
      {
        id: 2,
        tracking_number: "APP-456",
        applicant_name: "John Smith",
        applicant_email: "john@example.com",
        company_name: "Beta Ltd",
        application_type: "Renewal",
        status: "Approved",
        updated_at: "2026-05-22T10:00:00Z",
      },
    ]);

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("APP-123")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /draft/i }));

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
