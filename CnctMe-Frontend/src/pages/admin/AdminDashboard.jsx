import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  PieChart as PieChartIcon,
  ShieldCheck,
  TrendingUp,
  Users,
  UserCheck,
  UserRoundX,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  fetchAdminDashboard,
  selectAdminDashboard,
  selectAdminDashboardLoading,
  selectAdminError,
} from "../../features/admin/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const dashboard = useSelector(selectAdminDashboard);
  const loading = useSelector(selectAdminDashboardLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  // LOADING
  if (loading && !dashboard) {
    return <DashboardSkeleton />;
  }

  // ERROR
  if (error && !dashboard) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error.general || "Something went wrong. Please try again."}
          </p>

          <button
            type="button"
            onClick={() => dispatch(fetchAdminDashboard())}
            className="mt-4 rounded-lg bg-[#0859A8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#064A8F]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  // DASHBOARD DATA
  const users = dashboard.users || {};
  const companies = dashboard.companies || {};
  const jobs = dashboard.jobs || {};
  const applications = dashboard.applications || {};
  const reports = dashboard.reports || {};
  const thisMonth = dashboard.thisMonth || {};

  // USER DISTRIBUTION DATA
  const userDistributionData = [
    {
      name: "Job Seekers",
      value: users.jobSeekers || 0,
    },
    {
      name: "Recruiters",
      value: users.recruiters || 0,
    },
    {
      name: "Admins",
      value: users.admins || 0,
    },
  ];

  const userDistributionColors = ["#0859A8", "#4F7CAC", "#B78300"];

  // JOB STATUS DATA
  const jobStatusData = [
    {
      name: "Active",
      value: jobs.active || 0,
    },
    {
      name: "Closed",
      value: jobs.closed || 0,
    },
  ];

  const jobStatusColors = ["#267A4A", "#8998A6"];

  // PLATFORM OVERVIEW DATA
  const platformOverviewData = [
    {
      name: "Users",
      value: users.total || 0,
    },
    {
      name: "Companies",
      value: companies.total || 0,
    },
    {
      name: "Jobs",
      value: jobs.total || 0,
    },
    {
      name: "Applications",
      value: applications.total || 0,
    },
  ];

  // THIS MONTH DATA
  const monthlyActivityData = [
    {
      name: "New Users",
      value: thisMonth.users || 0,
    },
    {
      name: "New Jobs",
      value: thisMonth.jobs || 0,
    },
    {
      name: "New Applications",
      value: thisMonth.applications || 0,
    },
  ];

  // PRIMARY STATS
  const primaryStats = [
    {
      title: "Total Users",
      value: users.total || 0,
      subtitle: `${users.active || 0} active users`,
      icon: Users,
    },
    {
      title: "Companies",
      value: companies.total || 0,
      subtitle: "Registered companies",
      icon: Building2,
    },
    {
      title: "Total Jobs",
      value: jobs.total || 0,
      subtitle: `${jobs.active || 0} active jobs`,
      icon: BriefcaseBusiness,
    },
    {
      title: "Applications",
      value: applications.total || 0,
      subtitle: "Total applications",
      icon: FileText,
    },
    {
      title: "Pending Reports",
      value: reports.pending || 0,
      subtitle: `${reports.total || 0} total reports`,
      icon: AlertTriangle,
      alert: reports.pending > 0,
    },
    {
      title: "Blocked Users",
      value: users.blocked || 0,
      subtitle: "Currently blocked",
      icon: UserRoundX,
      alert: users.blocked > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-[#0859A8]">
            Administration
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage the CnctMe platform.
          </p>
        </div>

        <Link
          to="/admin/reports"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064A8F]"
        >
          <AlertTriangle size={17} />
          View Reports
        </Link>
      </div>

      {/* ====================================== */}
      {/* PRIMARY STATS */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#25364A]">
                    {stat.value.toLocaleString()}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      stat.alert
                        ? "font-medium text-amber-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.subtitle}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    stat.alert
                      ? "bg-amber-50 text-amber-600"
                      : "bg-[#E6EFF8] text-[#0859A8]"
                  }`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================== */}
      {/* PLATFORM ANALYTICS */}
      {/* ====================================== */}

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-sm font-medium text-[#0859A8]">
            Platform Analytics
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#25364A]">
            CnctMe Overview
          </h2>

          <p className="mt-1 text-sm text-[#8998A6]">
            Visual overview of users, jobs, companies, and applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* ==================================== */}
          {/* USER DISTRIBUTION */}
          {/* ==================================== */}

          <div className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EFF8]">
                <PieChartIcon size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  User Distribution
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Users grouped by platform role
                </p>
              </div>
            </div>

            {userDistributionData.every((item) => item.value === 0) ? (
              <EmptyChart
                icon={PieChartIcon}
                title="No user data"
                description="User distribution will appear here."
              />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={userDistributionColors[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E6EFF8",
                        boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      }}
                      labelStyle={{
                        color: "#25364A",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                        color: "#68798A",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ==================================== */}
          {/* JOB STATUS */}
          {/* ==================================== */}

          <div className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6FB]">
                <BriefcaseBusiness size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  Job Status
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Current job posting breakdown
                </p>
              </div>
            </div>

            {jobStatusData.every((item) => item.value === 0) ? (
              <EmptyChart
                icon={BriefcaseBusiness}
                title="No job data"
                description="Job statistics will appear here."
              />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={entry.name} fill={jobStatusColors[index]} />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E6EFF8",
                        boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      }}
                      labelStyle={{
                        color: "#25364A",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                        color: "#68798A",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ==================================== */}
          {/* PLATFORM OVERVIEW */}
          {/* ==================================== */}

          <div className="xl:col-span-2 rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F2F0]">
                <BarChart3 size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  Platform Overview
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Total platform activity by category
                </p>
              </div>
            </div>

            {platformOverviewData.every((item) => item.value === 0) ? (
              <EmptyChart
                icon={BarChart3}
                title="No platform data"
                description="Platform statistics will appear here."
              />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={platformOverviewData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6EFF8" />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "#8998A6",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8998A6",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E6EFF8",
                        boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      }}
                      labelStyle={{
                        color: "#25364A",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                      itemStyle={{
                        color: "#0859A8",
                        fontSize: 12,
                      }}
                      formatter={(value) => [value, "Total"]}
                    />

                    <Bar
                      dataKey="value"
                      fill="#0859A8"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ====================================== */}
          {/* USER + JOB OVERVIEW */}
          {/* ====================================== */}

          <div className="xl:col-span-2 mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* USER OVERVIEW */}

            <section className="h-57.5 rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#25364A]">
                    User Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Current platform users by role and status.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
                  <Users size={19} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <OverviewItem
                  label="Job Seekers"
                  value={users.jobSeekers}
                  icon={UserCheck}
                />

                <OverviewItem
                  label="Recruiters"
                  value={users.recruiters}
                  icon={Users}
                />

                <OverviewItem
                  label="Admins"
                  value={users.admins}
                  icon={ShieldCheck}
                />

                <OverviewItem
                  label="Active"
                  value={users.active}
                  icon={CheckCircle2}
                />
              </div>
            </section>

            {/* JOB OVERVIEW */}

            <section className="h-57.5 rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Job Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Current job posting status.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
                  <BriefcaseBusiness size={19} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <OverviewItem
                  label="Total"
                  value={jobs.total}
                  icon={BriefcaseBusiness}
                />

                <OverviewItem
                  label="Active"
                  value={jobs.active}
                  icon={CheckCircle2}
                />

                <OverviewItem
                  label="Closed"
                  value={jobs.closed}
                  icon={FileText}
                />
              </div>
            </section>
          </div>

          {/* ==================================== */}
          {/* THIS MONTH ACTIVITY */}
          {/* ==================================== */}

          <div className="xl:col-span-2 rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EFF8]">
                <TrendingUp size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  This Month Activity
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  New users, jobs, and applications this month
                </p>
              </div>
            </div>

            {monthlyActivityData.every((item) => item.value === 0) ? (
              <EmptyChart
                icon={TrendingUp}
                title="No monthly activity"
                description="New activity will appear here."
              />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyActivityData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6EFF8" />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "#8998A6",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8998A6",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E6EFF8",
                        boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      }}
                      labelStyle={{
                        color: "#25364A",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                      itemStyle={{
                        color: "#0859A8",
                        fontSize: 12,
                      }}
                      formatter={(value) => [value, "New"]}
                    />

                    <Bar
                      dataKey="value"
                      fill="#4F7CAC"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* THIS MONTH SUMMARY */}
      {/* ====================================== */}

      <section className="mt-6 rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
            <Activity size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#25364A]">This Month</h2>

            <p className="text-sm text-gray-500">
              New activity since the beginning of this month.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MonthlyCard title="New Users" value={thisMonth.users} icon={Users} />

          <MonthlyCard
            title="New Jobs"
            value={thisMonth.jobs}
            icon={BriefcaseBusiness}
          />

          <MonthlyCard
            title="New Applications"
            value={thisMonth.applications}
            icon={FileText}
          />
        </div>
      </section>

      {/* ====================================== */}
      {/* REPORT ALERT */}
      {/* ====================================== */}

      {reports.pending > 0 && (
        <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-600">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-amber-800">
                Reports need attention
              </h3>

              <p className="mt-1 text-sm text-amber-700">
                There are {reports.pending} pending report
                {reports.pending === 1 ? "" : "s"} awaiting review.
              </p>
            </div>
          </div>

          <Link
            to="/admin/reports"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Review Reports
          </Link>
        </section>
      )}
    </div>
  );
};

// ==========================================
// OVERVIEW ITEM
// ==========================================

const OverviewItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-[#E6EFF8] bg-[#F8FAFC] px-3 py-3">
      <Icon size={16} className="text-[#0859A8]" />

      <p className="mt-2 text-lg font-bold text-[#25364A]">
        {(value || 0).toLocaleString()}
      </p>

      <p className="mt-0.5 truncate text-[11px] text-gray-500">{label}</p>
    </div>
  );
};

// ==========================================
// MONTHLY CARD
// ==========================================

const MonthlyCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E6EFF8] bg-[#F8FAFC] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-2xl font-bold text-[#25364A]">
          {(value || 0).toLocaleString()}
        </p>

        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};

// ==========================================
// EMPTY CHART
// ==========================================

const EmptyChart = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl bg-[#F8FAFC]">
      <div className="text-center">
        <Icon size={28} className="mx-auto mb-2 text-[#8998A6]" />

        <p className="text-sm font-medium text-[#25364A]">{title}</p>

        <p className="mt-1 text-xs text-[#8998A6]">{description}</p>
      </div>
    </div>
  );
};

// ==========================================
// DASHBOARD SKELETON
// ==========================================

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Header */}

        <div className="mb-7">
          <div className="h-4 w-28 rounded bg-gray-200" />

          <div className="mt-3 h-8 w-64 rounded bg-gray-200" />

          <div className="mt-2 h-4 w-80 max-w-full rounded bg-gray-200" />
        </div>

        {/* Primary stats */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>

        {/* Analytics */}

        <div className="mt-8">
          <div className="mb-5">
            <div className="h-4 w-32 rounded bg-gray-200" />

            <div className="mt-2 h-6 w-48 rounded bg-gray-200" />

            <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="h-80 rounded-2xl bg-white" />

            <div className="h-80 rounded-2xl bg-white" />

            <div className="h-80 rounded-2xl bg-white xl:col-span-2" />

            <div className="h-80 rounded-2xl bg-white xl:col-span-2" />
          </div>
        </div>

        {/* User + Job overview */}

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-57.5 rounded-2xl bg-white" />

          <div className="h-57.5 rounded-2xl bg-white" />
        </div>

        {/* Monthly */}

        <div className="mt-6 h-44 rounded-2xl bg-white" />
      </div>
    </div>
  );
};

export default AdminDashboard;
