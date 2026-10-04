require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const savedJobsRoutes = require("./routes/savedJobsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminCompanyRoutes = require("./routes/adminCompanyRoutes");
const adminJobRoutes = require("./routes/adminJobRoutes");
const adminApplicationRoutes = require("./routes/adminApplicationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminReportRoutes = require("./routes/adminReportRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", savedJobsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/companies", adminCompanyRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin/reports", adminReportRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CnctMe API is running",
  });
});

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// CENTRAL ERROR HANDLER
// ==========================================

app.use(errorMiddleware);

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
