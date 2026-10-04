import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

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
} from "recharts";

import {
  selectApplicationsTrend,
  selectApplicationStatus,
} from "../../features/jobseeker/jobseekerSlice";

import { useSelector } from "react-redux";

const STATUS_COLORS = {
  Applied: "#0859A8",
  "Under Review": "#B78300",
  Shortlisted: "#DAA801",
  Interview: "#4F7CAC",
  Selected: "#267A4A",
  Rejected: "#C94A4A",
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
        <Icon size={21} strokeWidth={1.8} />
      </div>

      <h3 className="text-sm font-semibold text-[#25364A]">{title}</h3>

      <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#8998A6]">
        {description}
      </p>
    </div>
  );
};

const AnalyticsSection = () => {
  const applicationsTrend = useSelector(selectApplicationsTrend);
  const applicationStatus = useSelector(selectApplicationStatus);

  const hasTrendData =
    Array.isArray(applicationsTrend) && applicationsTrend.length > 0;

  const hasStatusData =
    Array.isArray(applicationStatus) &&
    applicationStatus.some((item) => item.count > 0);

  const statusChartData = Array.isArray(applicationStatus)
    ? applicationStatus.filter((item) => item.count > 0)
    : [];

  return (
    <div>
      {/* Section Heading */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 size={19} className="text-[#0859A8]" strokeWidth={2} />

          <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
            Job Search Analytics
          </h2>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
          Track your application activity and see how your job search is
          progressing.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Applications Trend */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#0859A8]" strokeWidth={2} />

            <div>
              <h3 className="text-sm font-semibold text-[#25364A]">
                Applications Trend
              </h3>

              <p className="text-xs text-[#8998A6]">
                Applications submitted over the last 6 months
              </p>
            </div>
          </div>

          {hasTrendData ? (
            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationsTrend}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E6EBEF"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#8998A6",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#8998A6",
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #DCE3E8",
                      boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      fontSize: "12px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#0859A8"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "#FFFFFF",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No application activity yet"
              description="Your application trend will appear here once you start applying for jobs."
            />
          )}
        </Card>

        {/* Application Status */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon
              size={18}
              className="text-[#0859A8]"
              strokeWidth={2}
            />

            <div>
              <h3 className="text-sm font-semibold text-[#25364A]">
                Application Status
              </h3>

              <p className="text-xs text-[#8998A6]">
                Current status of your applications
              </p>
            </div>
          </div>

          {hasStatusData ? (
            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || "#8998A6"}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #DCE3E8",
                      boxShadow: "0 4px 12px rgba(37, 54, 74, 0.08)",
                      fontSize: "12px",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#52606D",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={PieChartIcon}
              title="No application statuses yet"
              description="Your application status breakdown will appear here once you submit applications."
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;
