import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProjectList from "./pages/Admin/ProjectList";
import FundRelease from "./pages/Admin/FundRelease";
import ContractorMgmt from "./pages/Admin/ContractorMgmt";
import Transactions from "./pages/Admin/Transactions";
import Reports from "./pages/Admin/Reports";
import AdminAlerts from "./pages/Admin/Alerts";
import Settings from "./pages/Admin/Settings";
import ClaimSubmission from "./pages/Contractor/ClaimSubmission";
import AuditorDashboard from "./pages/Auditor/Dashboard";
import CommandCenter from "./pages/Auditor/CommandCenter";
import ReviewClaim from "./pages/Auditor/ReviewClaim";
import AuditReport from "./pages/Auditor/AuditReport";
import AuditorReviews from "./pages/Auditor/Reviews";
import AuditorAlerts from "./pages/Auditor/Alerts";
import AuditorSettings from "./pages/Auditor/Settings";
import AuditorLayout from "./components/AuditorLayout";
import AdminLayout from "./components/AdminLayout";
import PublicLayout from "./components/PublicLayout";
import PublicHome from "./pages/Public/Home";
import Explorer from "./pages/Public/Explorer";
import PublicSearch from "./pages/Public/Search";
import ProjectDetails from "./pages/Public/ProjectDetails";
import ReportIssue from "./pages/Public/ReportIssue";
import LiveMap from "./pages/Public/LiveMap";
import PublicSettings from "./pages/Public/Settings";

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
        <Route path="settings" element={<AuditorSettings />} />
      </Route>

      <Route path="/public" element={<PublicLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<PublicHome />} />
        <Route path="explorer" element={<Explorer />} />
        <Route path="search" element={<PublicSearch />} />
        <Route path="map" element={<LiveMap />} />
        <Route path="project-details/:id" element={<ProjectDetails />} />
        <Route path="report-issue" element={<ReportIssue />} />
        <Route path="settings" element={<PublicSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
