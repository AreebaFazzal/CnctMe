import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useSelector } from "react-redux";

import {
  selectApplicationsTrend,
  selectApplicationStatus,
  selectJobPerformance,
} from "../../features/recruiter/recruiterSlice";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import Card from "../ui/Card";

const AnalyticsSection = () => {
  const applicationsTrend = useSelector(selectApplicationsTrend);
  const applicationStatus = useSelector(selectApplicationStatus);
  const jobPerformance = useSelector(selectJobPerformance);

  const statusData = applicationStatus.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const statusColors = {
    Applied: "#0859A8",
    "Under Review": "#B78300",
    Shortlisted: "#DAA801",
    Interview: "#4F7CAC",
    Selected: "#267A4A",
    Rejected: "#C94A4A",
  };

  const jobPerformanceData = jobPerformance.map((job) => ({
    name: job.title,
    applicants: job.applicants,
  }));

  return (
    <section className="mt-6">
      {/* ====================================== */}
      {/* Section Header */}
      {/* ====================================== */}

      <div className="mb-5">
        <p className="text-sm font-medium text-[#0859A8]">
          Recruitment Analytics
        </p>

        <h2 className="mt-1 text-xl font-bold text-[#25364A]">
          Recruitment Overview
        </h2>

        <p className="mt-1 text-sm text-[#8998A6]">
          Track applications, candidate progress, and job performance.
        </p>
      </div>

      {/* ====================================== */}
      {/* Analytics Grid */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ==================================== */}
        {/* Applications Trend */}
        {/* ==================================== */}

        <Card>
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EFF8]">
                <TrendingUp size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  Applications Trend
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Applications received over time
                </p>
              </div>
            </div>
          </div>

          {applicationsTrend.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-[#F8FAFC]">
              <div className="text-center">
                <BarChart3 size={28} className="mx-auto mb-2 text-[#8998A6]" />

                <p className="text-sm font-medium text-[#25364A]">
                  No application data
                </p>

                <p className="mt-1 text-xs text-[#8998A6]">
                  Application trends will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationsTrend}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6EFF8" />

                  <XAxis
                    dataKey="month"
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
                    formatter={(value) => [value, "Applications"]}
                  />

                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0859A8"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "#FFFFFF",
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* ==================================== */}
        {/* Application Status */}
        {/* ==================================== */}

        <Card>
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6FB]">
                <PieChartIcon size={18} className="text-[#0859A8]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#25364A]">
                  Application Status
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Candidate application breakdown
                </p>
              </div>
            </div>
          </div>

          {applicationStatus.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-[#F8FAFC]">
              <div className="text-center">
                <PieChartIcon
                  size={28}
                  className="mx-auto mb-2 text-[#8998A6]"
                />

                <p className="text-sm font-medium text-[#25364A]">
                  No status data
                </p>

                <p className="mt-1 text-xs text-[#8998A6]">
                  Application statuses will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={statusColors[entry.name] || "#8998A6"}
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
                    formatter={(value, name) => [value, name]}
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
        </Card>

        {/* ==================================== */}
        {/* Job Performance */}
        {/* ==================================== */}

        <div className="xl:col-span-2">
          <Card>
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F2F0]">
                  <BarChart3 size={18} className="text-[#0859A8]" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#25364A]">
                    Job Performance
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Applicants received for each job
                  </p>
                </div>
              </div>
            </div>

            {jobPerformance.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-xl bg-[#F8FAFC]">
                <div className="text-center">
                  <BarChart3
                    size={28}
                    className="mx-auto mb-2 text-[#8998A6]"
                  />

                  <p className="text-sm font-medium text-[#25364A]">
                    No job performance data
                  </p>

                  <p className="mt-1 text-xs text-[#8998A6]">
                    Job applicant statistics will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={jobPerformanceData}
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
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={55}
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
                      formatter={(value) => [value, "Applicants"]}
                    />

                    <Bar
                      dataKey="applicants"
                      fill="#0859A8"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
