const Application = require("../models/applicationModel");
const SavedJob = require("../models/savedJobsModel");

const getJobSeekerDashboard = async (req, res) => {
  const userId = req.user.userId;

  // ==========================================
  // GET USER APPLICATIONS
  // ==========================================

  const applications = await Application.find({
    user: userId,
  }).select("status createdAt");

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) =>
      application.status === "Applied" || application.status === "Under Review",
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "Shortlisted",
  ).length;

  const interviewApplications = applications.filter(
    (application) => application.status === "Interview",
  ).length;

  const selectedApplications = applications.filter(
    (application) => application.status === "Selected",
  ).length;

  const savedJobs = await SavedJob.countDocuments({
    user: userId,
  });

  const statuses = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
  ];

  const applicationStatus = statuses.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status)
      .length,
  }));

  // ==========================================
  // APPLICATION TREND - LAST 6 MONTHS
  // ==========================================

  const now = new Date();

  const applicationsTrend = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = date.toLocaleString("en-US", {
      month: "short",
    });

    const count = applications.filter((application) => {
      const applicationDate = new Date(application.createdAt);

      return (
        applicationDate.getFullYear() === year &&
        applicationDate.getMonth() === month
      );
    }).length;

    applicationsTrend.push({
      month: monthName,
      applications: count,
    });
  }

  return res.status(200).json({
    success: true,

    dashboard: {
      // Quick Stats
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      interviewApplications,
      selectedApplications,
      savedJobs,

      // Analytics
      applicationsTrend,
      applicationStatus,
    },
  });
};

module.exports = {
  getJobSeekerDashboard,
};
