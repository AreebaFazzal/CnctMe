const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const Report = require("../models/reportModel");

const getAdminDashboard = async (req, res) => {
  const startOfMonth = new Date();

  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalRecruiters,
    totalJobSeekers,
    totalAdmins,
    activeUsers,
    blockedUsers,

    totalCompanies,

    totalJobs,
    activeJobs,
    closedJobs,

    totalApplications,

    pendingReports,
    totalReports,

    usersThisMonth,
    jobsThisMonth,
    applicationsThisMonth,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "recruiter",
    }),

    User.countDocuments({
      role: "jobseeker",
    }),

    User.countDocuments({
      role: "admin",
    }),

    User.countDocuments({
      status: "active",
    }),

    User.countDocuments({
      status: "blocked",
    }),

    Company.countDocuments(),

    Job.countDocuments(),

    Job.countDocuments({
      status: "active",
    }),

    Job.countDocuments({
      status: "closed",
    }),

    Application.countDocuments(),

    Report.countDocuments({
      status: "pending",
    }),

    Report.countDocuments(),

    User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),

    Job.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),

    Application.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),
  ]);

  return res.status(200).json({
    success: true,

    dashboard: {
      users: {
        total: totalUsers,
        recruiters: totalRecruiters,
        jobSeekers: totalJobSeekers,
        admins: totalAdmins,
        active: activeUsers,
        blocked: blockedUsers,
      },

      companies: {
        total: totalCompanies,
      },

      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs,
      },

      applications: {
        total: totalApplications,
      },

      reports: {
        total: totalReports,
        pending: pendingReports,
      },

      thisMonth: {
        users: usersThisMonth,
        jobs: jobsThisMonth,
        applications: applicationsThisMonth,
      },
    },
  });
};

module.exports = {
  getAdminDashboard,
};
