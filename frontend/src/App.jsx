import { Link, NavLink, Route, Routes } from "react-router-dom";

import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationFormPage } from "./pages/ApplicationFormPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";

export default function App() {
  const navClassName = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium transition",
      isActive ? "bg-ink text-foam" : "text-ink/70 hover:bg-white/70 hover:text-ink",
    ].join(" ");

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link className="text-xl font-bold tracking-tight text-ink" to="/">
            Workflow Tracker
          </Link>
          <nav className="flex flex-wrap gap-3">
            <NavLink className={navClassName} to="/">
              Applications
            </NavLink>
            <NavLink className={navClassName} to="/applications/new">
              New Application
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
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
