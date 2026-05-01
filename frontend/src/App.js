import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProjectList from "./pages/Admin/ProjectList";
import FundRelease from "./pages/Admin/FundRelease";
import ContractorMgmt from "./pages/Admin/ContractorMgmt";
import Transactions from "./pages/Admin/Transactions";
import Reports from "./pages/Admin/Reports";
import AdminAlerts from "./pages/Admin/Alerts";
import Users from "./pages/Admin/Users";
import Settings from "./pages/Admin/Settings";
import ClaimSubmission from "./pages/Contractor/ClaimSubmission";
import AuditorDashboard from "./pages/Auditor/Dashboard";
import CommandCenter from "./pages/Auditor/CommandCenter";
import ReviewClaim from "./pages/Auditor/ReviewClaim";
import AuditReport from "./pages/Auditor/AuditReport";
import AuditorReviews from "./pages/Auditor/Reviews";
import AuditorAlerts from "./pages/Auditor/Alerts";
import Explorer from "./pages/Public/Explorer";
import AdminLayout from "./components/AdminLayout";

import AuditorLayout from "./components/AuditorLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="fund-release" element={<FundRelease />} />
        <Route path="contractors" element={<ContractorMgmt />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/contractor/claim" element={<ClaimSubmission />} />

      <Route path="/auditor" element={<AuditorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AuditorDashboard />} />
        <Route path="command-center" element={<CommandCenter />} />
        <Route path="review-claim" element={<ReviewClaim />} />
        <Route path="audit-report" element={<AuditReport />} />
        <Route path="reviews" element={<AuditorReviews />} />
        <Route path="alerts" element={<AuditorAlerts />} />
      </Route>

      <Route path="/public/explorer" element={<Explorer />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
