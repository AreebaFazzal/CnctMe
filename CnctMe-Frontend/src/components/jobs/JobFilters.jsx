import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";

import {
  clearFilters,
  fetchJobs,
  selectJobFilters,
  setCategory,
  setExperience,
  setJobType,
  setLocation,
  setSalaryRange,
  setSorting,
  setWorkMode,
  setCurrentPage,
} from "../../features/jobs/jobsSlice";

const JOB_TYPES = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

const WORK_MODES = [
  { label: "On-site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Any", min: "", max: "" },
  { label: "0–1 years", min: 0, max: 1 },
  { label: "1–3 years", min: 1, max: 3 },
  { label: "3–5 years", min: 3, max: 5 },
  { label: "5+ years", min: 5, max: "" },
];

const CATEGORIES = [
  { value: "", label: "Select category" },

  // TECHNOLOGY
  { value: "Software & IT", label: "Software & IT" },

  // ENGINEERING
  { value: "Engineering", label: "Engineering" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering" },
  { value: "Electrical Engineering", label: "Electrical Engineering" },
  { value: "Civil Engineering", label: "Civil Engineering" },
  { value: "Chemical Engineering", label: "Chemical Engineering" },
  { value: "Electronics Engineering", label: "Electronics Engineering" },
  { value: "Industrial Engineering", label: "Industrial Engineering" },
  { value: "Environmental Engineering", label: "Environmental Engineering" },

  // ARCHITECTURE & CONSTRUCTION
  { value: "Architecture", label: "Architecture" },
  { value: "Construction", label: "Construction" },

  // HEALTHCARE
  { value: "Healthcare & Medical", label: "Healthcare & Medical" },
  { value: "Nursing", label: "Nursing" },
  { value: "Pharmaceutical", label: "Pharmaceutical" },
  { value: "Biotechnology", label: "Biotechnology" },

  // BUSINESS & FINANCE
  { value: "Finance & Accounting", label: "Finance & Accounting" },
  { value: "Banking", label: "Banking" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing & Advertising", label: "Marketing & Advertising" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Administration", label: "Administration" },
  { value: "Operations", label: "Operations" },

  // SUPPLY CHAIN
  { value: "Supply Chain & Logistics", label: "Supply Chain & Logistics" },
  { value: "Procurement", label: "Procurement" },

  // MANUFACTURING & AUTOMOTIVE
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Automotive", label: "Automotive" },

  // DESIGN & MEDIA
  { value: "Design & Creative", label: "Design & Creative" },
  { value: "Media & Journalism", label: "Media & Journalism" },
  { value: "Content & Writing", label: "Content & Writing" },

  // EDUCATION
  { value: "Education & Training", label: "Education & Training" },

  // LEGAL
  { value: "Legal", label: "Legal" },

  // TELECOMMUNICATIONS
  { value: "Telecommunications", label: "Telecommunications" },

  // HOSPITALITY & RETAIL
  { value: "Hospitality & Tourism", label: "Hospitality & Tourism" },
  { value: "Retail", label: "Retail" },
  { value: "Food & Restaurant", label: "Food & Restaurant" },

  // REAL ESTATE
  { value: "Real Estate", label: "Real Estate" },

  // AGRICULTURE
  { value: "Agriculture", label: "Agriculture" },

  // GOVERNMENT & SOCIAL
  { value: "Government & Public Sector", label: "Government & Public Sector" },
  { value: "Social Services & NGO", label: "Social Services & NGO" },

  // RESEARCH
  { value: "Research & Development", label: "Research & Development" },

  // SECURITY
  { value: "Security", label: "Security" },

  // BEAUTY & WELLNESS
  { value: "Beauty & Wellness", label: "Beauty & Wellness" },

  // SPORTS
  { value: "Sports & Fitness", label: "Sports & Fitness" },

  // OTHER
  { value: "Other", label: "Other" },
];

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.value !== "");

const SORT_OPTIONS = [
  { value: "oldest", label: "Oldest" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
];

const SALARY_MIN = 20000;
const SALARY_MAX = 130000;

const JobFilters = () => {
  const dispatch = useDispatch();

  const filters = useSelector(selectJobFilters);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // COUNT ACTIVE FILTERS
  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.location) {
      count++;
    }

    if (filters.jobType?.length > 0) {
      count++;
    }

    if (filters.workMode) {
      count++;
    }

    if (filters.experienceMin !== "" || filters.experienceMax !== "") {
      count++;
    }

    if (filters.salaryMin !== "" || filters.salaryMax !== "") {
      count++;
    }

    if (filters.category) {
      count++;
    }

    if (filters.sorting) {
      count++;
    }

    return count;
  }, [filters]);

  // JOB TYPE
  const handleJobTypeChange = (value) => {
    const currentTypes = filters.jobType || [];

    if (currentTypes.includes(value)) {
      dispatch(setJobType(currentTypes.filter((type) => type !== value)));
    } else {
      dispatch(setJobType([...currentTypes, value]));
    }
  };

  // WORK MODE
  const handleWorkModeChange = (value) => {
    if (filters.workMode === value) {
      dispatch(setWorkMode(""));
    } else {
      dispatch(setWorkMode(value));
    }
  };

  // EXPERIENCE
  const handleExperienceChange = (option) => {
    dispatch(
      setExperience({
        min: option.min,
        max: option.max,
      }),
    );
  };

  // SALARY
  const handleSalaryChange = (e) => {
    const value = Number(e.target.value);

    dispatch(
      setSalaryRange({
        min: SALARY_MIN,
        max: value,
      }),
    );
  };

  // APPLY FILTERS
  const handleApplyFilters = () => {
    dispatch(setCurrentPage(1));

    dispatch(
      fetchJobs({
        filters: {
          ...filters,
        },
        currentPage: 1,
      }),
    );

    setIsMobileOpen(false);
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    const emptyFilters = {
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
    };

    dispatch(clearFilters());

    dispatch(
      fetchJobs({
        filters: emptyFilters,
        currentPage: 1,
      }),
    );
  };

  // SALARY DISPLAY VALUE
  const salaryValue =
    filters.salaryMax !== "" ? Number(filters.salaryMax) : SALARY_MAX;

  return (
    <>
      {/* ======================================================
          MOBILE FILTER BAR
          Visible below lg breakpoint
      ====================================================== */}

      <div className="mb-4 lg:hidden">
        <div className="overflow-hidden rounded-xl border border-[#DCE3E8] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              aria-expanded={isMobileOpen}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]/10">
                <svg
                  className="h-5 w-5 text-[#0A66C2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707L15 13v6a1 1 0 01-.445.832l-4 2.5A1 1 0 019 21.5V13L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#25364A]">
                    Filters
                  </span>

                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0A66C2] px-1.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 truncate text-xs text-[#8998A6]">
                  Refine your job search
                </p>
              </div>
            </button>

            {/* RIGHT SIDE */}

            <div className="flex shrink-0 items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-md px-2 py-1.5 text-xs font-semibold text-[#0A66C2] transition-colors hover:bg-[#E6EFF8]"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE3E8] text-[#5F6B76] transition-all hover:border-[#0A66C2] hover:bg-[#F5F9FD] hover:text-[#0A66C2]"
                aria-label={isMobileOpen ? "Close filters" : "Open filters"}
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE FILTER CONTENT */}

          {isMobileOpen && (
            <div className="border-t border-[#E8EDF1]">
              <div className="max-h-[65vh] overflow-y-auto px-4">
                {/* LOCATION */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
                    Location
                  </label>

                  <Input
                    value={filters.location}
                    onChange={(e) => dispatch(setLocation(e.target.value))}
                    placeholder="e.g. Karachi"
                  />
                </div>

                {/* JOB TYPE */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <label className="mb-3 block text-sm font-semibold text-[#25364A]">
                    Job Type
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((type) => {
                      const selected = filters.jobType?.includes(type.value);

                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleJobTypeChange(type.value)}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                            selected
                              ? "border-[#0A66C2] bg-[#0A66C2] text-white shadow-sm shadow-[#0A66C2]/20"
                              : "border-[#DCE3E8] bg-white text-[#5F6B76] hover:border-[#0A66C2] hover:bg-[#F5F9FD] hover:text-[#0A66C2]"
                          }`}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* WORK MODE */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <label className="mb-3 block text-sm font-semibold text-[#25364A]">
                    Work Mode
                  </label>

                  <div className="grid grid-cols-3 rounded-xl border border-[#DCE3E8] bg-[#F8FAFC] p-1">
                    {WORK_MODES.map((mode) => {
                      const selected = filters.workMode === mode.value;

                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => handleWorkModeChange(mode.value)}
                          className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            selected
                              ? "bg-[#E6EFF8] text-[#0A66C2] shadow-sm"
                              : "text-[#5F6B76] hover:bg-white hover:text-[#0A66C2]"
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <label className="mb-3 block text-sm font-semibold text-[#25364A]">
                    Experience
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_OPTIONS.map((option) => {
                      const selected =
                        filters.experienceMin === option.min &&
                        filters.experienceMax === option.max;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => handleExperienceChange(option)}
                          className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            selected
                              ? "border-[#0A66C2] bg-[#0A66C2] text-white shadow-sm"
                              : "border-[#DCE3E8] bg-white text-[#5F6B76] hover:border-[#0A66C2] hover:bg-[#F5F9FD] hover:text-[#0A66C2]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SALARY */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-[#25364A]">
                      Salary
                    </label>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        filters.salaryMax !== ""
                          ? "bg-[#0A66C2]/10 text-[#0A66C2]"
                          : "bg-[#F3F5F7] text-[#8998A6]"
                      }`}
                    >
                      {filters.salaryMax !== ""
                        ? `Up to ${salaryValue.toLocaleString()}`
                        : "Any salary"}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] px-4 py-4">
                    <input
                      type="range"
                      min={SALARY_MIN}
                      max={SALARY_MAX}
                      step={5000}
                      value={salaryValue}
                      onChange={handleSalaryChange}
                      className="w-full cursor-pointer accent-[#0A66C2]"
                    />

                    <div className="mt-3 flex justify-between text-[11px] font-medium text-[#8998A6]">
                      <span>PKR {SALARY_MIN.toLocaleString()}</span>

                      <span>PKR {SALARY_MAX.toLocaleString()}+</span>
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}

                <div className="border-b border-[#E8EDF1] py-5">
                  <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
                    Category
                  </label>

                  <Select
                    id="category-mobile"
                    name="category"
                    value={filters.category}
                    onChange={(e) => dispatch(setCategory(e.target.value))}
                    options={CATEGORY_OPTIONS}
                    placeholder="Select category"
                    className="rounded-xl py-3 font-medium"
                  />
                </div>

                {/* SORTING */}

                <div className="py-5">
                  <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
                    Sort By
                  </label>

                  <Select
                    id="sorting-mobile"
                    name="sorting"
                    value={filters.sorting}
                    onChange={(e) => dispatch(setSorting(e.target.value))}
                    options={SORT_OPTIONS}
                    placeholder="Newest"
                    className="rounded-xl py-3 font-medium"
                  />
                </div>
              </div>

              {/* MOBILE APPLY */}

              <div className="border-t border-[#E8EDF1] bg-[#F8FAFC] p-4">
                <Button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          DESKTOP FILTER SIDEBAR
          Visible from lg breakpoint
      ====================================================== */}

      <aside className="hidden overflow-hidden rounded-2xl border border-[#DCE3E8] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] lg:block">
        {/* HEADER */}

        <div className="border-b border-[#E8EDF1] px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2]/10">
                <svg
                  className="h-5 w-5 text-[#0A66C2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707L15 13v6a1 1 0 01-.445.832l-4 2.5A1 1 0 019 21.5V13L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#25364A]">
                  Filters
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Refine your job search
                </p>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#B8D4EE] bg-[#E6EFF8] px-2.5 py-1.5 text-[11px] font-semibold text-[#0A66C2] transition-all duration-200 hover:border-[#0A66C2] hover:bg-[#D4E7F7]"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 01-1-1h-4a1 1 0 01-1 1v3m-4 0h14"
                  />
                </svg>

                <span>Clear</span>

                <span className="rounded-full bg-[#0A66C2] px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* FILTER CONTENT */}

        <div className="space-y-0 px-5">
          {/* LOCATION */}

          <div className="border-b border-[#E8EDF1] py-5">
            <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
              Location
            </label>

            <Input
              value={filters.location}
              onChange={(e) => dispatch(setLocation(e.target.value))}
              placeholder="e.g. Karachi"
            />
          </div>

          {/* JOB TYPE */}

          <div className="border-b border-[#E8EDF1] py-5">
            <label className="mb-3 block text-sm font-semibold text-[#25364A]">
              Job Type
            </label>

            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => {
                const selected = filters.jobType?.includes(type.value);

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleJobTypeChange(type.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                      selected
                        ? "border-[#0A66C2] bg-[#0A66C2] text-white shadow-sm shadow-[#0A66C2]/20"
                        : "border-[#DCE3E8] bg-white text-[#5F6B76] hover:border-[#0A66C2] hover:bg-[#F5F9FD] hover:text-[#0A66C2]"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* WORK MODE */}

          <div className="border-b border-[#E8EDF1] py-5">
            <label className="mb-3 block text-sm font-semibold text-[#25364A]">
              Work Mode
            </label>

            <div className="grid grid-cols-3 rounded-xl border border-[#DCE3E8] bg-[#F8FAFC] p-1">
              {WORK_MODES.map((mode) => {
                const selected = filters.workMode === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleWorkModeChange(mode.value)}
                    className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-[#E6EFF8] text-[#0A66C2] shadow-sm"
                        : "text-[#5F6B76] hover:bg-white hover:text-[#0A66C2]"
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXPERIENCE */}

          <div className="border-b border-[#E8EDF1] py-5">
            <label className="mb-3 block text-sm font-semibold text-[#25364A]">
              Experience
            </label>

            <div className="grid grid-cols-2 gap-2">
              {EXPERIENCE_OPTIONS.map((option) => {
                const selected =
                  filters.experienceMin === option.min &&
                  filters.experienceMax === option.max;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleExperienceChange(option)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      selected
                        ? "border-[#0A66C2] bg-[#0A66C2] text-white shadow-sm"
                        : "border-[#DCE3E8] bg-white text-[#5F6B76] hover:border-[#0A66C2] hover:bg-[#F5F9FD] hover:text-[#0A66C2]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SALARY */}

          <div className="border-b border-[#E8EDF1] py-5">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-semibold text-[#25364A]">
                Salary
              </label>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  filters.salaryMax !== ""
                    ? "bg-[#0A66C2]/10 text-[#0A66C2]"
                    : "bg-[#F3F5F7] text-[#8998A6]"
                }`}
              >
                {filters.salaryMax !== ""
                  ? `Up to ${salaryValue.toLocaleString()}`
                  : "Any salary"}
              </span>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] px-4 py-4">
              <input
                type="range"
                min={SALARY_MIN}
                max={SALARY_MAX}
                step={5000}
                value={salaryValue}
                onChange={handleSalaryChange}
                className="w-full cursor-pointer accent-[#0A66C2]"
              />

              <div className="mt-3 flex justify-between text-[11px] font-medium text-[#8998A6]">
                <span>PKR {SALARY_MIN.toLocaleString()}</span>

                <span>PKR {SALARY_MAX.toLocaleString()}+</span>
              </div>
            </div>
          </div>

          {/* CATEGORY */}

          <div className="border-b border-[#E8EDF1] py-5">
            <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
              Category
            </label>

            <Select
              id="category-desktop"
              name="category"
              value={filters.category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              className="rounded-xl py-3 font-medium"
            />
          </div>

          {/* SORTING */}

          <div className="py-5">
            <label className="mb-2.5 block text-sm font-semibold text-[#25364A]">
              Sort By
            </label>

            <Select
              id="sorting-desktop"
              name="sorting"
              value={filters.sorting}
              onChange={(e) => dispatch(setSorting(e.target.value))}
              options={SORT_OPTIONS}
              placeholder="Newest"
              className="rounded-xl py-3 font-medium"
            />
          </div>
        </div>

        {/* APPLY BUTTON */}

        <div className="border-t border-[#E8EDF1] bg-[#F8FAFC] px-5 py-5">
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="w-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Apply Filters
          </Button>
        </div>
      </aside>
    </>
  );
};

export default JobFilters;
