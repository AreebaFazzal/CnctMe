import { useEffect, useState } from "react";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

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

// Scrolls to and focuses the first invalid field (by its name attribute)
const scrollToFirstError = (errors) => {
  const keys = Object.keys(errors);

  if (!keys.length) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const element = Array.from(document.querySelectorAll("form [name]")).find(
    (node) => keys.includes(node.getAttribute("name")),
  );

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus({ preventScroll: true });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const PostJobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // FORM DATA
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    category: "",
    experienceMin: "",
    experienceMax: "",
    jobType: "",
    workMode: "",
    skills: "",
  });

  // STATES
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  // FETCH JOB FOR EDIT MODE
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);

        const job = response.data?.job;

        if (!job) {
          setError("Job could not be found.");
          return;
        }

        setFormData({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          salaryMin: job.salaryMin ?? "",
          salaryMax: job.salaryMax ?? "",
          category: job.category || "",
          experienceMin: job.experienceMin ?? "",
          experienceMax: job.experienceMax ?? "",
          jobType: job.jobType || "",
          workMode: job.workMode || "",
          skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
        });
      } catch (error) {
        console.error("Fetch Job Error:", error);

        const apiError = getApiError(error);

        setError(
          apiError?.general ||
            apiError?.message ||
            "Unable to load the job. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchJob();
    }
  }, [id, isEditMode]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "experienceMin" || name === "experienceMax") &&
      value !== "" &&
      Number(value) < 0
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  };

  // VALIDATE FORM
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Job title is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required.";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required.";
    }

    if (formData.salaryMin === "") {
      errors.salaryMin = "Minimum salary is required.";
    }

    if (formData.salaryMax === "") {
      errors.salaryMax = "Maximum salary is required.";
    }

    if (
      formData.salaryMin !== "" &&
      formData.salaryMax !== "" &&
      Number(formData.salaryMax) < Number(formData.salaryMin)
    ) {
      errors.salaryMax =
        "Maximum salary must be greater than or equal to minimum salary.";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required.";
    }

    if (formData.experienceMin === "") {
      errors.experienceMin = "Minimum experience is required.";
    }

    if (formData.experienceMax === "") {
      errors.experienceMax = "Maximum experience is required.";
    }

    if (formData.experienceMin !== "" && Number(formData.experienceMin) < 0) {
      errors.experienceMin = "Minimum experience cannot be negative.";
    }

    if (formData.experienceMax !== "" && Number(formData.experienceMax) < 0) {
      errors.experienceMax = "Maximum experience cannot be negative.";
    }

    if (
      formData.experienceMin !== "" &&
      formData.experienceMax !== "" &&
      Number(formData.experienceMax) < Number(formData.experienceMin)
    ) {
      errors.experienceMax =
        "Maximum experience must be greater than or equal to minimum experience.";
    }

    if (!formData.jobType) {
      errors.jobType = "Job type is required.";
    }

    if (!formData.workMode) {
      errors.workMode = "Work mode is required.";
    }

    if (!formData.skills.trim()) {
      errors.skills = "Please enter at least one skill.";
    }

    setFieldErrors(errors);

    return errors;
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setFieldErrors({});

    // FRONTEND VALIDATION
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the highlighted fields below.");
      scrollToFirstError(validationErrors);
      return;
    }

    // CONVERT SKILLS TO ARRAY
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (skillsArray.length === 0) {
      const skillsError = {
        skills: "Please enter at least one skill.",
      };

      setFieldErrors(skillsError);
      setError("Please fix the highlighted fields below.");
      scrollToFirstError(skillsError);

      return;
    }

    // DATA SENT TO BACKEND
    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),

      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),

      category: formData.category.trim(),

      experienceMin: Number(formData.experienceMin),
      experienceMax: Number(formData.experienceMax),

      jobType: formData.jobType,
      workMode: formData.workMode,

      skills: skillsArray,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        console.log("Updating Job:", jobData);

        const response = await api.put(`/jobs/${id}`, jobData);

        setSuccess(
          response.data?.message || "Job has been updated successfully.",
        );

        setTimeout(() => {
          navigate("/recruiter/jobs");
        }, 1000);

        return;
      }

      const response = await api.post("/jobs", jobData);

      setSuccess(
        response.data?.message || "Job has been created successfully.",
      );

      // RESET FORM
      setFormData({
        title: "",
        description: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        category: "",
        experienceMin: "",
        experienceMax: "",
        jobType: "",
        workMode: "",
        skills: "",
      });

      // REDIRECT AFTER SUCCESS
      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1000);
    } catch (error) {
      console.error(
        isEditMode ? "Update Job Error:" : "Create Job Error:",
        error,
      );

      const apiError = getApiError(error);

      // getApiError returns a flat object:
      // { general: "...", title: "...", salaryMax: "..." }
      const errors = {};

      Object.entries(apiError || {}).forEach(([key, value]) => {
        if (key === "general" || key === "message") return;
        if (typeof value === "string" && value) errors[key] = value;
      });

      // Also support an { errors: [{ path, msg }] } array if present
      if (Array.isArray(apiError?.errors)) {
        apiError.errors.forEach((item) => {
          if (item.path) {
            errors[item.path] = item.msg || item.message;
          }
        });
      }

      setFieldErrors(errors);

      setError(
        apiError?.general ||
          apiError?.message ||
          (Object.keys(errors).length > 0
            ? "Please fix the highlighted fields below."
            : isEditMode
              ? "Unable to update the job. Please try again."
              : "Unable to create job. Please try again."),
      );

      scrollToFirstError(errors);
    } finally {
      setSaving(false);
    }
  };

  // CANCEL
  const handleCancel = () => {
    navigate(isEditMode ? "/recruiter/jobs" : "/recruiter/dashboard");
  };

  // LOADING STATE FOR EDIT MODE
  if (isEditMode && loading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        <div className="mb-6 min-w-0 sm:mb-7">
          <p className="text-xs font-medium text-[#0859A8] sm:text-sm">
            Job Management
          </p>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
            Edit Job
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            Update your job listing and keep the information accurate for
            candidates.
          </p>
        </div>

        <Card className="mx-auto min-w-0 max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-40 rounded bg-[#E6EFF8]" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="h-11 rounded-lg bg-[#F3F2F0] md:col-span-2" />
              <div className="h-11 rounded-lg bg-[#F3F2F0]" />
              <div className="h-11 rounded-lg bg-[#F3F2F0]" />
              <div className="h-11 rounded-lg bg-[#F3F2F0]" />
              <div className="h-11 rounded-lg bg-[#F3F2F0]" />
            </div>

            <div className="border-t border-[#EEF1F4] pt-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="h-11 rounded-lg bg-[#F3F2F0]" />
                <div className="h-11 rounded-lg bg-[#F3F2F0]" />
                <div className="h-11 rounded-lg bg-[#F3F2F0]" />
                <div className="h-11 rounded-lg bg-[#F3F2F0]" />
              </div>
            </div>

            <div className="border-t border-[#EEF1F4] pt-6">
              <div className="h-11 rounded-lg bg-[#F3F2F0]" />
            </div>

            <div className="border-t border-[#EEF1F4] pt-6">
              <div className="h-40 rounded-lg bg-[#F3F2F0]" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ======================================================
  // MAIN FORM
  // SAME UI FOR CREATE + EDIT
  // ======================================================

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-6 min-w-0 sm:mb-7">
        <p className="text-xs font-medium text-[#0859A8] sm:text-sm">
          Job Management
        </p>

        <h1 className="mt-1 text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
          {isEditMode ? "Edit Job" : "Post a New Job"}
        </h1>

        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
          {isEditMode
            ? "Update your job listing and keep the information accurate for candidates."
            : "Create a job listing and find the right candidates for your company."}
        </p>
      </div>

      {/* ==========================================
          JOB FORM
      ========================================== */}

      <div className="min-w-0">
        <Card className="mx-auto min-w-0 max-w-5xl">
          <form onSubmit={handleSubmit} noValidate className="min-w-0">
            {/* =========================
                SUCCESS MESSAGE
            ========================= */}

            {success && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-relaxed text-green-700 sm:mb-6">
                {success}
              </div>
            )}

            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-relaxed text-red-600 sm:mb-6">
                {error}
              </div>
            )}

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <div className="mb-6 min-w-0 sm:mb-7">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                  <BriefcaseBusiness size={19} className="text-[#0859A8]" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#25364A]">
                    Basic Information
                  </h2>

                  <p className="text-xs leading-relaxed text-[#8998A6]">
                    {isEditMode
                      ? "Update the main details of your job."
                      : "Add the main details about this job."}
                  </p>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                {/* JOB TITLE */}

                <div className="min-w-0 md:col-span-2">
                  <Input
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />

                  {fieldErrors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* LOCATION */}

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-[#25364A]">
                    Location
                  </label>

                  <div className="relative min-w-0">
                    <MapPin
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8998A6]"
                    />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Lahore, Pakistan"
                      required
                      className="h-11 w-full min-w-0 rounded-lg border border-[#DCE3E8] bg-white pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#AAB4BE] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
                    />
                  </div>

                  {fieldErrors.location && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.location}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}

                <div className="min-w-0">
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    options={CATEGORY_OPTIONS}
                  />

                  {fieldErrors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.category}
                    </p>
                  )}
                </div>

                {/* JOB TYPE */}

                <div className="min-w-0">
                  <Select
                    label="Job Type"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    options={[
                      {
                        value: "full-time",
                        label: "Full Time",
                      },
                      {
                        value: "part-time",
                        label: "Part Time",
                      },
                      {
                        value: "contract",
                        label: "Contract",
                      },
                      {
                        value: "internship",
                        label: "Internship",
                      },
                    ]}
                  />

                  {fieldErrors.jobType && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.jobType}
                    </p>
                  )}
                </div>

                {/* WORK MODE */}

                <div className="min-w-0">
                  <Select
                    label="Work Mode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    required
                    options={[
                      {
                        value: "on-site",
                        label: "On-site",
                      },
                      {
                        value: "remote",
                        label: "Remote",
                      },
                      {
                        value: "hybrid",
                        label: "Hybrid",
                      },
                    ]}
                  />

                  {fieldErrors.workMode && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.workMode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =========================
                SALARY & EXPERIENCE
            ========================= */}

            <div className="mb-6 min-w-0 border-t border-[#EEF1F4] pt-6 sm:mb-7 sm:pt-7">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#25364A]">
                  Salary & Experience
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-[#8998A6]">
                  Specify the expected salary range and experience requirements.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* MIN SALARY */}

                <div className="min-w-0">
                  <Input
                    label="Minimum Salary"
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g. 80000"
                    min="0"
                    required
                  />

                  {fieldErrors.salaryMin && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.salaryMin}
                    </p>
                  )}
                </div>

                {/* MAX SALARY */}

                <div className="min-w-0">
                  <Input
                    label="Maximum Salary"
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="e.g. 150000"
                    min="0"
                    required
                  />

                  {fieldErrors.salaryMax && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.salaryMax}
                    </p>
                  )}
                </div>

                {/* MIN EXPERIENCE */}

                <div className="min-w-0">
                  <Input
                    label="Minimum Experience"
                    name="experienceMin"
                    type="number"
                    value={formData.experienceMin}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    min="0"
                    required
                  />

                  {fieldErrors.experienceMin && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.experienceMin}
                    </p>
                  )}
                </div>

                {/* MAX EXPERIENCE */}

                <div className="min-w-0">
                  <Input
                    label="Maximum Experience"
                    name="experienceMax"
                    type="number"
                    value={formData.experienceMax}
                    onChange={handleChange}
                    placeholder="e.g. 4"
                    min="0"
                    required
                  />

                  {fieldErrors.experienceMax && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.experienceMax}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =========================
                SKILLS
            ========================= */}

            <div className="mb-6 min-w-0 border-t border-[#EEF1F4] pt-6 sm:mb-7 sm:pt-7">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#25364A]">
                  Required Skills
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-[#8998A6]">
                  Add the skills candidates should have for this position.
                </p>
              </div>

              <div className="min-w-0">
                <Input
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                  required
                />
              </div>

              {fieldErrors.skills && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.skills}
                </p>
              )}

              <p className="mt-2 text-xs leading-relaxed text-[#8998A6]">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* =========================
                JOB DESCRIPTION
            ========================= */}

            <div className="mb-6 min-w-0 border-t border-[#EEF1F4] pt-6 sm:mb-7 sm:pt-7">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#25364A]">
                  Job Description
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-[#8998A6]">
                  Describe the role, responsibilities, and requirements.
                </p>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-[#25364A]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  maxLength={5000}
                  required
                  placeholder="Describe the job responsibilities, requirements, qualifications, and other important information..."
                  className="w-full min-w-0 resize-y rounded-lg border border-[#DCE3E8] bg-white px-3 py-3 text-sm leading-relaxed text-[#25364A] outline-none transition placeholder:text-[#AAB4BE] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
                />

                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.description}
                  </p>
                )}

                <div className="mt-1.5 text-right text-xs text-[#8998A6]">
                  {formData.description.length}/5000
                </div>
              </div>
            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EEF1F4] pt-5 sm:flex-row sm:justify-end sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={saving}
                loadingColor="#F8FAFC"
                disabled={saving || loading}
              >
                {saving
                  ? isEditMode
                    ? "Saving Changes..."
                    : "Posting Job..."
                  : isEditMode
                    ? "Save Changes"
                    : "Post Job"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJobForm;
