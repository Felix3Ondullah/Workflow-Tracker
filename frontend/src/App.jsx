import { Link, NavLink, Route, Routes } from "react-router-dom";

import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationFormPage } from "./pages/ApplicationFormPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";

export default function App() {
  const navClassName = ({ isActive }) =>
    [
      "rounded-lg px-4 py-2 text-[12px] font-medium transition",
      isActive ? "bg-emerald-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link className="text-base font-semibold tracking-tight text-slate-700" to="/">
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

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
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
