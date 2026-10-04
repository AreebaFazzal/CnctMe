import {
  BriefcaseBusiness,
  Users,
  CalendarDays,
  UserCheck,
} from "lucide-react";

import { useSelector } from "react-redux";

import {
  selectTotalJobs,
  selectActiveJobs,
  selectClosedJobs,
  selectTotalApplicants,
  selectShortlistedApplicants,
  selectTotalInterviews,
  selectSelectedCandidates,
} from "../../features/recruiter/recruiterSlice";

import Card from "../ui/Card";

const StatCard = () => {
  const totalJobs = useSelector(selectTotalJobs);
  const activeJobs = useSelector(selectActiveJobs);
  const closedJobs = useSelector(selectClosedJobs);
  const totalApplicants = useSelector(selectTotalApplicants);
  const shortlistedApplicants = useSelector(selectShortlistedApplicants);
  const totalInterviews = useSelector(selectTotalInterviews);
  const selectedCandidates = useSelector(selectSelectedCandidates);

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
      iconBg: "bg-[#EEF6FB]",
      iconColor: "text-[#0859A8]",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: BriefcaseBusiness,
      iconBg: "bg-[#EEF6FB]",
      iconColor: "text-[#0859A8]",
    },
    {
      title: "Closed Jobs",
      value: closedJobs,
      icon: BriefcaseBusiness,
      iconBg: "bg-[#F3F2F0]",
      iconColor: "text-[#52606D]",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      iconBg: "bg-[#EEF6FB]",
      iconColor: "text-[#0859A8]",
    },
    {
      title: "Shortlisted Applicants",
      value: shortlistedApplicants,
      icon: UserCheck,
      iconBg: "bg-[#EEF8F1]",
      iconColor: "text-[#2E8B57]",
    },
    {
      title: "Interviews",
      value: totalInterviews,
      icon: CalendarDays,
      iconBg: "bg-[#FFF9E8]",
      iconColor: "text-[#C99700]",
    },
    {
      title: "Selected Candidates",
      value: selectedCandidates,
      icon: UserCheck,
      iconBg: "bg-[#EEF8F1]",
      iconColor: "text-[#2E8B57]",
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
                <p className="warp-break-words text-[13px] font-medium leading-tight text-[#8998A6] sm:text-sm">
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

export default StatCard;
