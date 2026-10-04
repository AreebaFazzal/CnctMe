import {
  FileText,
  Clock3,
  UserCheck,
  CalendarDays,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

import { useSelector } from "react-redux";

import {
  selectTotalApplications,
  selectPendingApplications,
  selectShortlistedApplications,
  selectInterviewApplications,
  selectSelectedApplications,
  selectSavedJobs,
} from "../../features/jobseeker/jobseekerSlice";

import Card from "../ui/Card";

const QuickStats = () => {
  const totalApplications = useSelector(selectTotalApplications);
  const pendingApplications = useSelector(selectPendingApplications);
  const shortlistedApplications = useSelector(selectShortlistedApplications);
  const interviewApplications = useSelector(selectInterviewApplications);
  const selectedApplications = useSelector(selectSelectedApplications);
  const savedJobs = useSelector(selectSavedJobs);

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      iconBg: "bg-[#EEF6FB]",
      iconColor: "text-[#0859A8]",
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      icon: Clock3,
      iconBg: "bg-[#FFF9E8]",
      iconColor: "text-[#C99700]",
    },
    {
      title: "Shortlisted",
      value: shortlistedApplications,
      icon: UserCheck,
      iconBg: "bg-[#EEF8F1]",
      iconColor: "text-[#2E8B57]",
    },
    {
      title: "Interviews",
      value: interviewApplications,
      icon: CalendarDays,
      iconBg: "bg-[#EEF6FB]",
      iconColor: "text-[#4F7CAC]",
    },
    {
      title: "Selected",
      value: selectedApplications,
      icon: CheckCircle2,
      iconBg: "bg-[#EEF8F1]",
      iconColor: "text-[#2E8B57]",
    },
    {
      title: "Saved Jobs",
      value: savedJobs,
      icon: Bookmark,
      iconBg: "bg-[#F3F2F0]",
      iconColor: "text-[#52606D]",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="wrap-break-words text-[13px] font-medium leading-tight text-[#8998A6] sm:text-sm">
                  {stat.title}
                </p>

                <p className="mt-1.5 text-xl font-bold text-[#25364A] sm:mt-2 sm:text-2xl">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.iconBg}`}
              >
                <Icon size={21} strokeWidth={2} className={stat.iconColor} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
