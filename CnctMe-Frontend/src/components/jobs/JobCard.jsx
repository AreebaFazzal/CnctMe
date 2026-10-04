import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import getLogoSrc from "../../utils/logo";

const formatSalary = (n) => {
  if (n === undefined || n === null) return null;

  return n.toLocaleString();
};

const timeAgo = (date) => {
  if (!date) return null;

  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

  if (diff <= 0) return "Posted today";
  if (diff === 1) return "Posted yesterday";
  if (diff < 7) return `Posted ${diff}d ago`;

  return `Posted ${Math.floor(diff / 7)}w ago`;
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const [showAllSkills, setShowAllSkills] = useState(false);

  const skills = job.skills || [];

  const visibleSkills = showAllSkills ? skills : skills.slice(0, 4);

  const extraSkills = skills.length - 4;

  const companyName = job.company?.companyName || "Company";

  const companyInitial = companyName.charAt(0).toUpperCase();

  const companyLogo = job.company?.logo;

  const logoSrc = getLogoSrc(companyLogo, companyLogo?.contentType || null);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#DCE3E8] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0A66C2]/30 hover:shadow-[0_10px_22px_-8px_rgba(10,102,194,0.16)]">
      {/* Accent bar on hover */}
      <span className="absolute inset-x-0 top-0 h-0.75 scale-x-0 bg-linear-to-r from-[#0A66C2] to-[#3B9AE1] transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {/* Company Logo */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#0A66C2] bg-linear-to-br from-[#EEF6FB] to-[#E1EEF9] shadow-sm ring-2 ring-white">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={`${companyName} logo`}
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";

                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}

            <span
              className={`h-full w-full items-center justify-center rounded-full text-sm font-bold text-[#0A66C2] ${
                logoSrc ? "hidden" : "flex"
              }`}
            >
              {companyInitial}
            </span>
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-base font-bold tracking-tight text-[#16212B]">
              {job.title}
            </h3>

            <p className="mt-0.5 text-sm font-medium text-[#0A66C2]">
              {companyName}
            </p>

            {job.location && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#697586]">
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-[#8998A6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {job.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {job.description && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#697586]">
          {job.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.jobType && (
          <span className="rounded-full bg-[#E6EFF8] px-2.5 py-0.5 text-xs font-medium text-[#0A66C2]">
            {job.jobType}
          </span>
        )}

        {job.workMode && (
          <span className="rounded-full bg-[#E6EFF8] px-2.5 py-0.5 text-xs font-medium text-[#0A66C2]">
            {job.workMode}
          </span>
        )}

        {job.category && (
          <span className="rounded-full bg-[#F3F2F0] px-2.5 py-0.5 text-xs font-medium text-[#697586]">
            {job.category}
          </span>
        )}
      </div>

      {(job.salaryMin !== undefined && job.salaryMin !== null) ||
      (job.salaryMax !== undefined && job.salaryMax !== null) ? (
        <div className="mt-3 inline-flex items-center gap-1 rounded-md border border-[#B7E4C7] bg-[#EAFBF0] px-2 py-1">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-[#1A8B4C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v1.5M3 7.5v10.5A1.5 1.5 0 004.5 19.5h15a1.5 1.5 0 001.5-1.5V7.5M3 7.5h18M8 15h.008v.008H8V15z"
            />
            <circle cx="12" cy="12.75" r="1.75" strokeWidth={2} />
          </svg>
          <p className="text-xs font-bold text-[#1A8B4C]">
            {formatSalary(job.salaryMin) && formatSalary(job.salaryMax)
              ? `PKR ${formatSalary(job.salaryMin)} - ${formatSalary(
                  job.salaryMax,
                )}`
              : formatSalary(job.salaryMin)
                ? `From PKR ${formatSalary(job.salaryMin)}`
                : `Up to PKR ${formatSalary(job.salaryMax)}`}
          </p>
        </div>
      ) : null}

      {skills.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-md border border-[#C9DEF2] bg-[#F5FAFF] px-2.5 py-1 text-xs font-semibold text-[#0A66C2]"
              >
                {skill}
              </span>
            ))}

            {!showAllSkills && extraSkills > 0 && (
              <button
                type="button"
                onClick={() => setShowAllSkills(true)}
                className="rounded-md bg-[#F3F2F0] px-2.5 py-1 text-xs font-semibold text-[#0A66C2] transition hover:bg-[#E6EFF8]"
              >
                +{extraSkills} more
              </button>
            )}

            {showAllSkills && skills.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSkills(false)}
                className="rounded-md bg-[#F3F2F0] px-2.5 py-1 text-xs font-semibold text-[#0A66C2] transition hover:bg-[#E6EFF8]"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#E8EDF1] pt-3">
        <div>
          {timeAgo(job.createdAt) && (
            <p className="text-xs font-medium text-[#8998A6]">
              {timeAgo(job.createdAt)}
            </p>
          )}
        </div>

        <Button type="button" onClick={() => navigate(`/jobs/${job._id}`)}>
          View Job
        </Button>
      </div>
    </article>
  );
};

export default JobCard;
