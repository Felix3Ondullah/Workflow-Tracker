import { Link, NavLink, Route, Routes } from "react-router-dom";

import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationFormPage } from "./pages/ApplicationFormPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Workflow Tracker
        </Link>
        <nav className="topnav">
          <NavLink to="/">Applications</NavLink>
          <NavLink to="/applications/new">New Application</NavLink>
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<ApplicationListPage />} />
          <Route path="/applications/new" element={<ApplicationFormPage mode="create" />} />
          <Route path="/applications/:applicationId/edit" element={<ApplicationFormPage mode="edit" />} />
          <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
