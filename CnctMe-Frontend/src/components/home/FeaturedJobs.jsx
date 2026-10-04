import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Clock3,
} from "lucide-react";

import {
  fetchJobs,
  selectJobs,
  selectJobLoading,
  selectJobError,
} from "../../features/jobs/jobsSlice";
import getLogoSrc from "../../utils/logo";
const FeaturedJobs = () => {
  const dispatch = useDispatch();

  // Redux State
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobLoading);
  const error = useSelector(selectJobError);

  // Local State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  // Fetch Jobs
  useEffect(() => {
    dispatch(
      fetchJobs({
        currentPage: 1,
        filters: {
          search: "",
          location: "",
          jobType: [],
          workMode: "",
          experienceMin: "",
          experienceMax: "",
          salaryMin: "",
          salaryMax: "",
          category: "",
          sorting: "",
        },
      }),
    );
  }, [dispatch]);

  const featuredJobs = jobs.slice(0, 6);

  const handlePrevious = () => {
    if (!featuredJobs.length) return;

    setDirection("left");
    setCurrentIndex((current) =>
      current === 0 ? featuredJobs.length - 1 : current - 1,
    );
  };

  const handleNext = () => {
    if (!featuredJobs.length) return;

    setDirection("right");
    setCurrentIndex((current) =>
      current === featuredJobs.length - 1 ? 0 : current + 1,
    );
  };

  const handleGoTo = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Loading
  if (loading) {
    return (
      <section className="bg-[#F3F2F0] py-10 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-7 animate-pulse bg-[#DDE7EF]" />

              <div className="h-4 w-28 animate-pulse rounded bg-[#E6EFF8]" />

              <span className="h-px w-7 animate-pulse bg-[#DDE7EF]" />
            </div>

            <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded-lg bg-[#E6EFF8] sm:h-10" />

            <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-[#EEF2F6]" />
          </div>

          {/* Featured Job Skeleton */}
          <div className="relative mt-8">
            {/* Left Arrow Skeleton */}
            <div className="absolute left-1 top-1/2 z-10 h-9 w-9 -translate-y-1/2 animate-pulse rounded-full border border-[#DCE3E8] bg-white sm:-left-4 sm:h-10 sm:w-10" />

            {/* Right Arrow Skeleton */}
            <div className="absolute right-1 top-1/2 z-10 h-9 w-9 -translate-y-1/2 animate-pulse rounded-full border border-[#DCE3E8] bg-white sm:-right-4 sm:h-10 sm:w-10" />

            <div className="overflow-hidden rounded-3xl">
              <div className="relative border border-[#DCE3E8] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(16,24,40,0.12)] sm:p-7">
                <div className="animate-pulse">
                  {/* Company */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="h-14 w-14 shrink-0 rounded-full bg-[#E6EFF8] sm:h-16 sm:w-16" />

                      {/* Company Name */}
                      <div className="h-5 w-32 rounded bg-[#E6EFF8]" />
                    </div>

                    {/* Job Type */}
                    <div className="h-7 w-20 rounded-full bg-[#E6EFF8]" />
                  </div>

                  {/* Job Title */}
                  <div className="mt-5">
                    <div className="h-6 w-3/4 max-w-md rounded bg-[#E6EFF8]" />
                  </div>

                  {/* Job Information */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="h-8 w-36 rounded-lg bg-[#EEF2F6]" />
                    <div className="h-8 w-32 rounded-lg bg-[#EEF2F6]" />
                    <div className="h-8 w-44 rounded-lg bg-[#EEF2F6]" />
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-[#E8EDF1] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-4 w-72 max-w-full rounded bg-[#EEF2F6]" />

                    <div className="h-10 w-28 rounded-lg bg-[#E6EFF8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Skeleton */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-1.5 w-6 animate-pulse rounded-full bg-[#DDE7EF]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DDE7EF]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DDE7EF]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DDE7EF]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DDE7EF]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DDE7EF]" />
          </div>

          {/* View All Jobs Skeleton */}
          <div className="mt-8 flex justify-center">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-[#E6EFF8]" />
          </div>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.general || "Unable to load jobs. Please try again.";

    return (
      <section className="bg-[#F3F2F0] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">{errorMessage}</p>

              <button
                type="button"
                onClick={() => dispatch(fetchJobs())}
                className="mt-5 rounded-lg bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0859A8]"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No Jobs
  if (!featuredJobs.length) {
    return (
      <section className="bg-[#F3F2F0] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#0A66C2]" />

              <h3 className="mt-4 text-lg font-bold text-[#25364A]">
                No jobs available
              </h3>

              <p className="mt-2 text-sm text-[#697586]">
                There are currently no active jobs to display.
              </p>

              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center rounded-lg bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0859A8]"
              >
                Browse all jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Current Job
  const currentJob = featuredJobs[currentIndex];

  // Company
  const companyName = currentJob.company?.companyName || "Company";

  const companyInitial = companyName.charAt(0).toUpperCase();

  const companyLogo = currentJob.company?.logo;

  const logoSrc = getLogoSrc(companyLogo, companyLogo?.contentType || null);

  const location = currentJob.location || "Location not specified";

  const jobType = currentJob.jobType || "Full-time";

  const experience =
    currentJob.experience ||
    (currentJob.experienceMin !== undefined &&
    currentJob.experienceMax !== undefined
      ? `${currentJob.experienceMin} - ${currentJob.experienceMax} years`
      : currentJob.experienceMin !== undefined
        ? `${currentJob.experienceMin}+ years`
        : currentJob.experienceMax !== undefined
          ? `Up to ${currentJob.experienceMax} years`
          : "Not specified");

  const salary =
    currentJob.salaryMin !== undefined && currentJob.salaryMax !== undefined
      ? `PKR ${currentJob.salaryMin.toLocaleString()} - PKR ${currentJob.salaryMax.toLocaleString()}`
      : currentJob.salaryMin !== undefined
        ? `From PKR ${currentJob.salaryMin.toLocaleString()}`
        : currentJob.salaryMax !== undefined
          ? `Up to PKR ${currentJob.salaryMax.toLocaleString()}`
          : "Salary not specified";

  return (
    <section className="bg-[#F3F2F0] py-10 sm:py-12">
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-right { animation: slideInFromRight 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .slide-in-left { animation: slideInFromLeft 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* =========================
            Header (centered)
        ========================= */}
        <div className="flex flex-col items-center text-center">
          <div
            className="animate-fade-up flex items-center justify-center gap-3 opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="h-px w-7 bg-[#0A66C2]" />

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A66C2] sm:text-sm">
              FIND YOUR JOB
            </p>

            <span className="h-px w-7 bg-[#0A66C2]" />
          </div>

          <h2
            className="animate-fade-up mt-3 text-2xl font-bold tracking-tight text-[#25364A] opacity-0 sm:text-3xl lg:text-[32px]"
            style={{ animationDelay: "0.2s" }}
          >
            Explore opportunities made for you
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#697586]">
            Discover the latest job opportunities from companies looking for
            talented people like you.
          </p>
        </div>

        {/* =========================
            Featured Job Card + Side Arrows
        ========================= */}
        <div className="relative mt-8">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous job"
            className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE3E8] bg-white text-[#25364A] shadow-md transition hover:border-[#0A66C2] hover:bg-[#E6EFF8] hover:text-[#0A66C2] sm:-left-4 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next job"
            className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE3E8] bg-white text-[#25364A] shadow-md transition hover:border-[#0A66C2] hover:bg-[#E6EFF8] hover:text-[#0A66C2] sm:-right-4 sm:h-10 sm:w-10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="overflow-hidden rounded-3xl">
            <div
              key={currentIndex}
              className={`relative border border-[#DCE3E8] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(16,24,40,0.12)] sm:p-7 ${
                direction === "right" ? "slide-in-right" : "slide-in-left"
              }`}
            >
              {/* Decorative gradient blob */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-linear-to-br from-[#E6EFF8] to-transparent opacity-70" />

              <div className="relative">
                {/* Company */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {/* Company Logo / Initial */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#0A66C2] bg-linear-to-br from-[#EEF6FB] to-[#E1EEF9] shadow-sm ring-2 ring-white sm:h-16 sm:w-16">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={`${companyName} logo`}
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display =
                                "flex";
                            }
                          }}
                        />
                      ) : null}

                      <span
                        className={`h-full w-full items-center justify-center rounded-full text-xl font-bold text-[#0A66C2] ${
                          logoSrc ? "hidden" : "flex"
                        }`}
                      >
                        {companyInitial}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-md font-bold text-[#25364A]">
                        {companyName}
                      </h3>
                    </div>
                  </div>

                  {/* Job Type */}
                  <span className="inline-flex w-fit items-center rounded-full bg-[#E6EFF8] px-3.5 py-1.5 text-xs font-semibold text-[#0A66C2]">
                    {jobType}
                  </span>
                </div>

                {/* Job Title */}
                <div className="mt-5">
                  <h3 className="text-lg font-bold leading-snug text-[#25364A]">
                    {currentJob.title}
                  </h3>
                </div>

                {/* Job Information */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Location */}
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F6F7F8] px-3 py-1.5 text-xs font-medium text-[#697586]">
                    <MapPin className="h-3.5 w-3.5 text-[#0A66C2]" />
                    <span>{location}</span>
                  </div>

                  {/* Experience */}
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F6F7F8] px-3 py-1.5 text-xs font-medium text-[#697586]">
                    <Clock3 className="h-3.5 w-3.5 text-[#0A66C2]" />
                    <span>{experience}</span>
                  </div>

                  {/* Salary */}
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#B7E4C7] bg-[#EAFBF0] px-3 py-1.5 text-xs font-bold text-[#1A8B4C]">
                    <span>{salary}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex flex-col gap-3 border-t border-[#E8EDF1] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#8998A6]">
                    Find out more about this opportunity and apply today.
                  </p>

                  <Link
                    to={`/jobs/${currentJob._id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0859A8] hover:shadow-md"
                  >
                    View Job
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Dots
        ========================= */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {featuredJobs.map((job, index) => (
            <button
              key={job._id}
              type="button"
              onClick={() => handleGoTo(index)}
              aria-label={`Go to job ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-[#0A66C2]"
                  : "w-1.5 bg-[#C7D1DA] hover:bg-[#9FB4C6]"
              }`}
            />
          ))}
        </div>

        {/* =========================
            View All Jobs
        ========================= */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0A66C2] bg-white px-5 py-2.5 text-sm font-semibold text-[#0A66C2] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E6EFF8] hover:shadow-md"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
