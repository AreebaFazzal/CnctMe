import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// Public Pages
// =========================
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import CheckEmail from "../pages/CheckEmail";
import VerifyEmail from "../pages/VerifyEmail";
import ResendVerification from "../pages/ResendVerification";
import About from "../pages/About";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// =========================
// Job Pages
// =========================
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import MyJobs from "../pages/recruiter/MyJobs";
import ApplyJob from "../pages/ApplyJob";
import PostJob from "../pages/recruiter/PostJob";

// =========================
// Public User Pages
// =========================
import People from "../pages/People";
import PublicUserProfile from "../pages/PublicUserProfile";

// =========================
// Company Pages
// =========================
import Companies from "../pages/Companies";
import CompaniesDetails from "../pages/CompaniesDetails";
import Company from "../pages/recruiter/Company";

// =========================
// Recruiter Dashboards
// =========================
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterApplicantDetails from "../pages/recruiter/RecruiterApplicantDetails";
import RecruiterApplications from "../pages/recruiter/RecruiterApplications";
import RecruiterCandidateProfile from "../pages/recruiter/RecruiterCandidateProfile";
import Interviews from "../pages/recruiter/Interviews";
import Settings from "../pages/recruiter/Settings";
import Profile, { EditProfile } from "../pages/recruiter/Profile";

// =========================
// Jobseeker Dashboards
// =========================
import JobseekerDashboard from "../pages/jobseeker/JobseekerDashboard";
import JobseekerInterviews from "../pages/jobseeker/JobseekerInterviews";
import JobseekerProfile from "../pages/jobseeker/JobseekerProfile";
import MyApplications from "../pages/jobseeker/MyApplications";
import SavedJobs from "../pages/jobseeker/SavedJobs";
import JobseekerProfileEdit from "../pages/jobseeker/JobseekerProfileEdit";

// =========================
// Report Pages
// =========================
import MyReports from "../pages/reports/MyReports";

// =========================
// Admin Dashboards
// =========================
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminReports from "../pages/admin/AdminReports";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCompanies from "../pages/admin/AdminCompanies";
import AdminJobs from "../pages/admin/AdminJobs";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminApplicationDetails from "../pages/admin/AdminApplicationDetails";

// =========================
// Layouts
// =========================
import RecruiterLayout from "../components/layout/RecruiterLayout";
import JobseekerLayout from "../components/layout/JobseekerLayout";
import AdminLayout from "../components/layout/AdminLayout";

// =========================
// Route Protection
// =========================
import ProtectedRoutes from "./ProtectedRoutes";
import RoleRoutes from "./RoleRoutes";
import CompanyRequiredRoute from "./CompanyRequiredRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/companies" element={<Companies />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/check-email" element={<CheckEmail />} />

        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route path="/resend-verification" element={<ResendVerification />} />

        <Route path="/about" element={<About />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/people" element={<People />} />

        {/* ==========================================
            AUTHENTICATED ROUTES
        ========================================== */}

        <Route element={<ProtectedRoutes />}>
          {/* ========================================
              GENERAL AUTHENTICATED ROUTES
          ======================================== */}

          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/jobs/:id/apply" element={<ApplyJob />} />

          <Route path="/companies/:companyId" element={<CompaniesDetails />} />

          <Route path="/profile/:userId" element={<PublicUserProfile />} />

          {/* ========================================
              JOB SEEKER
          ======================================== */}

          <Route element={<RoleRoutes allowedRoles={["jobseeker"]} />}>
            <Route element={<JobseekerLayout />}>
              <Route
                path="/dashboard/jobseeker"
                element={<JobseekerDashboard />}
              />

              <Route path="/jobseeker/profile" element={<JobseekerProfile />} />

              <Route path="/jobseeker/saved-jobs" element={<SavedJobs />} />

              <Route
                path="/jobseeker/applications"
                element={<MyApplications />}
              />

              <Route
                path="/jobseeker/interviews"
                element={<JobseekerInterviews />}
              />

              <Route path="/jobseeker/settings" element={<Settings />} />

              <Route
                path="/jobseeker/profile/edit"
                element={<JobseekerProfileEdit />}
              />

              {/* My Reports */}
              <Route path="/jobseeker/reports" element={<MyReports />} />
            </Route>
          </Route>

          {/* ========================================
              RECRUITER
          ======================================== */}

          <Route element={<RoleRoutes allowedRoles={["recruiter"]} />}>
            <Route element={<RecruiterLayout />}>
              {/* Dashboard */}

              <Route
                path="/dashboard/recruiter"
                element={<RecruiterDashboard />}
              />

              {/* Company */}

              <Route path="/recruiter/company" element={<Company />} />

              {/* My Jobs */}

              <Route path="/recruiter/jobs" element={<MyJobs />} />

              {/* Applications */}

              <Route
                path="/recruiter/applications"
                element={<RecruiterApplications />}
              />

              {/* Application Details */}

              <Route
                path="/recruiter/applications/:applicationId"
                element={<RecruiterApplicantDetails />}
              />

              {/* Candidate Profile */}

              <Route
                path="/recruiter/candidates/:userId"
                element={<RecruiterCandidateProfile />}
              />

              {/* Interviews */}

              <Route path="/recruiter/interviews" element={<Interviews />} />

              {/* Recruiter Profile */}

              <Route path="/recruiter/profile" element={<Profile />} />

              <Route path="/recruiter/profile/edit" element={<EditProfile />} />

              {/* Settings */}

              <Route path="/recruiter/settings" element={<Settings />} />

              {/* My Reports */}

              <Route path="/recruiter/reports" element={<MyReports />} />

              {/* ------------------------------------
                  COMPANY REQUIRED
              ------------------------------------ */}

              <Route element={<CompanyRequiredRoute />}>
                {/* Create Job */}

                <Route path="/recruiter/jobs/create" element={<PostJob />} />

                {/* Edit Job */}

                <Route path="/recruiter/jobs/:id/edit" element={<PostJob />} />
              </Route>
            </Route>
          </Route>

          {/* ========================================
              ADMIN
          ======================================== */}

          <Route element={<RoleRoutes allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              <Route path="/admin/users" element={<AdminUsers />} />

              <Route path="/admin/companies" element={<AdminCompanies />} />

              <Route path="/admin/jobs" element={<AdminJobs />} />

              <Route
                path="/admin/applications"
                element={<AdminApplications />}
              />

              <Route
                path="/admin/applications/:applicationId"
                element={<AdminApplicationDetails />}
              />

              <Route path="/admin/reports" element={<AdminReports />} />

              <Route
                path="/admin/users/:userId/profile"
                element={<RecruiterCandidateProfile />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
