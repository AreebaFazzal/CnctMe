import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  ArrowLeft,
  Camera,
  Save,
  User,
  BriefcaseBusiness,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";

import api from "../../api/axios";

import getApiError from "../../utils/apiError";

import { updateUser } from "../../features/auth/authSlice";

// VALIDATION HELPERS
const CURRENT_YEAR = new Date().getFullYear();

const MIN_YEAR = 1950;

const MAX_YEAR = CURRENT_YEAR + 10;

const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeErrorKey = (key) => key.replace(/\[(\d+)\]/g, ".$1");

const FieldError = ({ message }) =>
  message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null;

const validateProfileForm = (formData, education, experience) => {
  const errors = {};

  // PERSONAL
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (
    formData.phoneNumber.trim() &&
    !/^\+?[\d\s()-]{7,20}$/.test(formData.phoneNumber.trim())
  ) {
    errors.phoneNumber = "Enter a valid phone number.";
  }

  // SOCIAL
  if (formData.linkedin.trim() && !isValidUrl(formData.linkedin.trim())) {
    errors.linkedin = "Enter a valid URL, e.g. https://linkedin.com/in/you";
  }

  if (formData.github.trim() && !isValidUrl(formData.github.trim())) {
    errors.github = "Enter a valid URL, e.g. https://github.com/you";
  }

  // EDUCATION
  education.forEach((item, i) => {
    const p = `education.${i}`;

    const startRaw = String(item.startYear || "").trim();
    const endRaw = String(item.endYear || "").trim();

    if (!item.degree?.trim()) {
      errors[`${p}.degree`] = "Degree is required.";
    }

    if (!item.institution?.trim()) {
      errors[`${p}.institution`] = "Institution is required.";
    }

    let startValid = false;

    if (!startRaw) {
      errors[`${p}.startYear`] = "Start year is required.";
    } else if (!/^\d{4}$/.test(startRaw)) {
      errors[`${p}.startYear`] = "Enter a 4-digit year, e.g. 2018.";
    } else if (Number(startRaw) < MIN_YEAR || Number(startRaw) > MAX_YEAR) {
      errors[`${p}.startYear`] =
        `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;
    } else {
      startValid = true;
    }

    if (endRaw && !item.currentlyStudying) {
      if (!/^\d{4}$/.test(endRaw)) {
        errors[`${p}.endYear`] = "Enter a 4-digit year, e.g. 2022.";
      } else if (Number(endRaw) < MIN_YEAR || Number(endRaw) > MAX_YEAR) {
        errors[`${p}.endYear`] =
          `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;
      } else if (startValid && Number(endRaw) < Number(startRaw)) {
        errors[`${p}.endYear`] = "End year cannot be earlier than start year.";
      }
    }
  });

  // EXPERIENCE
  const today = new Date().toISOString().slice(0, 10);

  experience.forEach((item, i) => {
    const p = `experience.${i}`;

    const startStr = item.startDate ? String(item.startDate).slice(0, 10) : "";
    const endStr = item.endDate ? String(item.endDate).slice(0, 10) : "";

    if (!item.jobTitle?.trim()) {
      errors[`${p}.jobTitle`] = "Job title is required.";
    }

    if (!item.company?.trim()) {
      errors[`${p}.company`] = "Company is required.";
    }

    if (!startStr) {
      errors[`${p}.startDate`] = "Start date is required.";
    } else if (startStr > today) {
      errors[`${p}.startDate`] = "Start date cannot be in the future.";
    }

    if (!item.currentlyWorking && endStr) {
      if (startStr && endStr < startStr) {
        errors[`${p}.endDate`] = "End date cannot be earlier than start date.";
      } else if (endStr > today) {
        errors[`${p}.endDate`] = "End date cannot be in the future.";
      }
    }
  });

  return errors;
};

// COMPONENT
const JobseekerProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    position: "",
    bio: "",
    linkedin: "",
    github: "",
    location: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    let profileImageUrl = "";

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/profile");

        const profile = response.data.user;

        setFormData({
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          phoneNumber: profile?.phoneNumber || "",
          position: profile?.position || "",
          bio: profile?.bio || "",
          linkedin: profile?.linkedin || "",
          github: profile?.github || "",
          location: profile?.location || "",
        });

        setSkills(Array.isArray(profile?.skills) ? profile.skills : []);

        setEducation(
          Array.isArray(profile?.education)
            ? profile.education
            : profile?.education
              ? [
                  {
                    degree: profile.education,
                    institution: "",
                    fieldOfStudy: "",
                    startYear: "",
                    endYear: "",
                    currentlyStudying: false,
                  },
                ]
              : [],
        );

        setExperience(
          Array.isArray(profile?.experience)
            ? profile.experience
            : profile?.experience
              ? [
                  {
                    jobTitle: profile.experience,
                    company: "",
                    startDate: "",
                    endDate: "",
                    currentlyWorking: false,
                    description: "",
                  },
                ]
              : [],
        );

        try {
          const pictureResponse = await api.get("/users/profile-picture", {
            responseType: "blob",
          });

          if (pictureResponse.data?.size > 0) {
            profileImageUrl = URL.createObjectURL(pictureResponse.data);

            setPreviewImage(profileImageUrl);
          }
        } catch (error) {
          setPreviewImage("");
          getApiError(error);
        }
      } catch (err) {
        const apiError = getApiError(err);

        setError(apiError.general || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, []);

  // ERROR HELPERS
  const clearFieldError = (...keys) => {
    setFieldErrors((previous) => {
      if (!keys.some((key) => previous[key])) return previous;

      const next = { ...previous };

      keys.forEach((key) => delete next[key]);

      return next;
    });
  };

  const borderClass = (key) =>
    fieldErrors[key] ? "border-red-400" : "border-[#D5E1EB]";

  const focusFirstError = (errors) => {
    const keys = Object.keys(errors);

    if (!keys.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = Array.from(document.querySelectorAll("[data-field]")).find(
      (node) => keys.includes(node.getAttribute("data-field")),
    );

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const applyServerErrors = (apiError) => {
    const mapped = {};
    let general = "";

    if (typeof apiError === "string") {
      general = apiError;
    } else if (apiError && typeof apiError === "object") {
      Object.entries(apiError).forEach(([key, value]) => {
        if (typeof value !== "string") return;

        if (key === "general" || key === "message") {
          general = general || value;
        } else {
          mapped[normalizeErrorKey(key)] = value;
        }
      });
    }

    setFieldErrors(mapped);

    setError(
      general ||
        Object.values(mapped)[0] ||
        "Failed to update your profile. Please try again.",
    );

    focusFirstError(mapped);
  };

  // HANDLERS
  const handleChange = (event) => {
    const { name, value } = event.target;

    clearFieldError(name);

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be smaller than 5MB.");
      return;
    }

    setError("");

    setProfilePicture(file);

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) {
      return;
    }

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase(),
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkills((previous) => [...previous, newSkill]);

    setSkillInput("");
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (index) => {
    setSkills((previous) =>
      previous.filter((_, skillIndex) => skillIndex !== index),
    );
  };

  // EDUCATION
  const addEducation = () => {
    setEducation((previous) => [
      ...previous,
      {
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
      },
    ]);
  };

  const updateEducation = (index, field, value) => {
    if (
      field === "startYear" ||
      field === "endYear" ||
      field === "currentlyStudying"
    ) {
      clearFieldError(
        `education.${index}.startYear`,
        `education.${index}.endYear`,
      );
    } else {
      clearFieldError(`education.${index}.${field}`);
    }

    setEducation((previous) =>
      previous.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const next = {
          ...item,
          [field]: value,
        };

        if (field === "currentlyStudying" && value) {
          next.endYear = "";
        }

        return next;
      }),
    );
  };

  const removeEducation = (index) => {
    setFieldErrors({});

    setEducation((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addExperience = () => {
    setExperience((previous) => [
      ...previous,
      {
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (index, field, value) => {
    if (
      field === "startDate" ||
      field === "endDate" ||
      field === "currentlyWorking"
    ) {
      clearFieldError(
        `experience.${index}.startDate`,
        `experience.${index}.endDate`,
      );
    } else {
      clearFieldError(`experience.${index}.${field}`);
    }

    setExperience((previous) =>
      previous.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const next = {
          ...item,
          [field]: value,
        };

        if (field === "currentlyWorking" && value) {
          next.endDate = "";
        }

        return next;
      }),
    );
  };

  const removeExperience = (index) => {
    setFieldErrors({});

    setExperience((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // SUBMIT
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationErrors = validateProfileForm(
      formData,
      education,
      experience,
    );

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please fix the highlighted fields below.");
      focusFirstError(validationErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      const cleanedEducation = education.map((item) => ({
        ...item,
        startYear: String(item.startYear || "").trim(),
        endYear: item.currentlyStudying
          ? ""
          : String(item.endYear || "").trim(),
        currentlyStudying: Boolean(item.currentlyStudying),
      }));

      const cleanedExperience = experience.map((item) => ({
        ...item,
        endDate: item.currentlyWorking ? "" : item.endDate || "",
      }));

      const data = new FormData();

      data.append("firstName", formData.firstName.trim());
      data.append("lastName", formData.lastName.trim());
      data.append("phoneNumber", formData.phoneNumber.trim());
      data.append("position", formData.position.trim());
      data.append("bio", formData.bio.trim());
      data.append("linkedin", formData.linkedin.trim());
      data.append("github", formData.github.trim());
      data.append("location", formData.location.trim());

      data.append("skills", JSON.stringify(skills));
      data.append("education", JSON.stringify(cleanedEducation));
      data.append("experience", JSON.stringify(cleanedExperience));

      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      const response = await api.put("/users/profile", data);

      dispatch(updateUser(response.data.user));

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/jobseeker/profile");
      }, 700);
    } catch (err) {
      applyServerErrors(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-[#D5E1EB] bg-white p-8">
            <div className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E6EFF8]" />

              <div className="h-4 w-72 animate-pulse rounded bg-[#F1F4F7]" />

              <div className="h-32 animate-pulse rounded-xl bg-[#F1F4F7]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <Link
            to="/jobseeker/profile"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#526170] transition hover:text-[#0859A8]"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0859A8]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs">
              Jobseeker Profile
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
            Edit Profile
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
            Update your personal information, professional background, and
            online presence.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            {/* PROFILE PICTURE */}
            <section className="border-b border-[#DDE7EF] bg-[#E6EFF8] p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#0859A8]">
                      {`${formData.firstName?.charAt(0) || ""}${formData.lastName?.charAt(0) || ""}` ||
                        "U"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Profile Picture
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-[#68798A] sm:text-sm">
                    Upload a professional profile picture. Maximum size is 5MB.
                  </p>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#BFD5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#0859A8] shadow-sm transition hover:border-[#0859A8] hover:bg-[#F8FBFD]">
                    <Camera size={17} />
                    Choose Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {profilePicture && (
                    <p className="mt-2 text-xs text-[#68798A]">
                      Selected: {profilePicture.name}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* PERSONAL INFORMATION */}
            <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                  <User size={18} className="text-[#526170]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Personal Information
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Update your basic personal and contact information.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#526170]">
                    First Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    data-field="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${borderClass(
                      "firstName",
                    )} bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                    placeholder="Enter your first name"
                  />

                  <FieldError message={fieldErrors.firstName} />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#526170]">
                    Last Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    data-field="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${borderClass(
                      "lastName",
                    )} bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                    placeholder="Enter your last name"
                  />

                  <FieldError message={fieldErrors.lastName} />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#526170]">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phoneNumber"
                    data-field="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${borderClass(
                      "phoneNumber",
                    )} bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                    placeholder="Enter your phone number"
                  />

                  <FieldError message={fieldErrors.phoneNumber} />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-[#526170]">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    data-field="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${borderClass(
                      "location",
                    )} bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                    placeholder="e.g. Karachi, Pakistan"
                  />

                  <FieldError message={fieldErrors.location} />
                </div>
              </div>
            </section>

            {/* PROFESSIONAL INFORMATION */}
            <section className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-5 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF]">
                  <BriefcaseBusiness size={18} className="text-[#526170]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Professional Information
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Tell recruiters about your professional background.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#526170]">
                  Professional Position
                </label>

                <input
                  type="text"
                  name="position"
                  data-field="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full rounded-xl border ${borderClass(
                    "position",
                  )} bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                  placeholder="e.g. Frontend Developer"
                />

                <FieldError message={fieldErrors.position} />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold text-[#526170]">
                  About
                </label>

                <textarea
                  name="bio"
                  data-field="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  maxLength={5000}
                  className={`w-full resize-y rounded-xl border ${borderClass(
                    "bio",
                  )} bg-white px-4 py-3 text-sm leading-6 text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                  placeholder="Write a short professional introduction..."
                />

                <div className="mt-1.5 flex items-start justify-between gap-3">
                  <FieldError message={fieldErrors.bio} />

                  <p className="ml-auto text-right text-[11px] text-[#8998A6]">
                    {formData.bio.length}/5000
                  </p>
                </div>
              </div>
            </section>

            {/* SKILLS */}
            <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Skills
                </h2>

                <p className="mt-1 text-xs text-[#8998A6]">
                  Add the skills you want recruiters to see.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="min-w-0 flex-1 rounded-xl border border-[#D5E1EB] bg-white px-4 py-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A1ADB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
                  placeholder="e.g. React, Node.js, Digital Marketing"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6EFF8] px-5 py-3 text-sm font-bold text-[#0859A8] transition hover:bg-[#D8E8F5]"
                >
                  <Plus size={17} />
                  Add Skill
                </button>
              </div>

              {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={`${skill}-${index}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3 py-2 text-xs font-semibold text-[#0859A8]"
                    >
                      <span>{skill}</span>

                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="rounded p-0.5 text-sm transition hover:bg-[#0859A8]/10"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SOCIAL PROFILES */}
            <section className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-5 sm:p-8">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Social Profiles
                </h2>

                <p className="mt-1 text-xs text-[#8998A6]">
                  Add links to your professional online profiles.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-[#526170]">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#E6EFF8] text-[10px] font-bold text-[#0859A8]">
                      in
                    </span>
                    LinkedIn
                  </label>

                  <input
                    type="url"
                    name="linkedin"
                    data-field="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/your-profile"
                    className={`w-full rounded-xl border ${borderClass(
                      "linkedin",
                    )} bg-white px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                  />

                  <FieldError message={fieldErrors.linkedin} />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold text-[#526170]">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#E6EFF8] text-[9px] font-bold text-[#0859A8]">
                      GH
                    </span>
                    GitHub
                  </label>

                  <input
                    type="url"
                    name="github"
                    data-field="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/your-username"
                    className={`w-full rounded-xl border ${borderClass(
                      "github",
                    )} bg-white px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                  />

                  <FieldError message={fieldErrors.github} />
                </div>
              </div>
            </section>

            {/* EDUCATION */}
            <section className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-5 sm:p-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF]">
                    <GraduationCap size={18} className="text-[#526170]" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                      Education
                    </h2>

                    <p className="mt-0.5 text-xs text-[#8998A6]">
                      Add your educational background.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFD5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#F8FBFD]"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>

              {education.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-8 text-center">
                  <p className="text-sm text-[#8998A6]">
                    No education added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((item, index) => (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#25364A]">
                          Education {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`education.${index}.degree`}
                            value={item.degree || ""}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "degree",
                                event.target.value,
                              )
                            }
                            placeholder="Degree"
                            className={`w-full rounded-xl border ${borderClass(
                              `education.${index}.degree`,
                            )} px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={fieldErrors[`education.${index}.degree`]}
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`education.${index}.institution`}
                            value={item.institution || ""}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "institution",
                                event.target.value,
                              )
                            }
                            placeholder="Institution"
                            className={`w-full rounded-xl border ${borderClass(
                              `education.${index}.institution`,
                            )} px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`education.${index}.institution`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`education.${index}.fieldOfStudy`}
                            value={item.fieldOfStudy || ""}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "fieldOfStudy",
                                event.target.value,
                              )
                            }
                            placeholder="Field of Study"
                            className={`w-full rounded-xl border ${borderClass(
                              `education.${index}.fieldOfStudy`,
                            )} px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`education.${index}.fieldOfStudy`]
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="min-w-0">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              data-field={`education.${index}.startYear`}
                              value={item.startYear || ""}
                              onChange={(event) =>
                                updateEducation(
                                  index,
                                  "startYear",
                                  event.target.value,
                                )
                              }
                              placeholder="Start Year"
                              className={`w-full rounded-xl border ${borderClass(
                                `education.${index}.startYear`,
                              )} px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                            />

                            <FieldError
                              message={
                                fieldErrors[`education.${index}.startYear`]
                              }
                            />
                          </div>

                          <div className="min-w-0">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              data-field={`education.${index}.endYear`}
                              disabled={Boolean(item.currentlyStudying)}
                              value={item.endYear || ""}
                              onChange={(event) =>
                                updateEducation(
                                  index,
                                  "endYear",
                                  event.target.value,
                                )
                              }
                              placeholder={
                                item.currentlyStudying ? "Present" : "End Year"
                              }
                              className={`w-full rounded-xl border ${borderClass(
                                `education.${index}.endYear`,
                              )} px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-[#F1F4F6] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                            />

                            <FieldError
                              message={
                                fieldErrors[`education.${index}.endYear`]
                              }
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium text-[#526170] sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={Boolean(item.currentlyStudying)}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "currentlyStudying",
                                event.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-[#BFD5E5] text-[#0859A8] focus:ring-[#0859A8]"
                          />
                          I currently study here
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* EXPERIENCE */}
            <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF]">
                    <BriefcaseBusiness size={18} className="text-[#526170]" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                      Experience
                    </h2>

                    <p className="mt-0.5 text-xs text-[#8998A6]">
                      Add your professional work experience.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFD5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#F8FBFD]"
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>

              {experience.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-8 text-center">
                  <p className="text-sm text-[#8998A6]">
                    No experience added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.map((item, index) => (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#25364A]">
                          Experience {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`experience.${index}.jobTitle`}
                            value={item.jobTitle || ""}
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "jobTitle",
                                event.target.value,
                              )
                            }
                            placeholder="Job Title"
                            className={`w-full rounded-xl border ${borderClass(
                              `experience.${index}.jobTitle`,
                            )} bg-white px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`experience.${index}.jobTitle`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`experience.${index}.company`}
                            value={item.company || ""}
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "company",
                                event.target.value,
                              )
                            }
                            placeholder="Company"
                            className={`w-full rounded-xl border ${borderClass(
                              `experience.${index}.company`,
                            )} bg-white px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={fieldErrors[`experience.${index}.company`]}
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="mb-2 block text-xs font-semibold text-[#68798A]">
                            Start Date
                          </label>

                          <input
                            type="date"
                            data-field={`experience.${index}.startDate`}
                            value={
                              item.startDate
                                ? String(item.startDate).slice(0, 10)
                                : ""
                            }
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "startDate",
                                event.target.value,
                              )
                            }
                            className={`w-full rounded-xl border ${borderClass(
                              `experience.${index}.startDate`,
                            )} bg-white px-4 py-3 text-sm outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`experience.${index}.startDate`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="mb-2 block text-xs font-semibold text-[#68798A]">
                            End Date
                          </label>

                          <input
                            type="date"
                            data-field={`experience.${index}.endDate`}
                            disabled={item.currentlyWorking}
                            value={
                              item.endDate
                                ? String(item.endDate).slice(0, 10)
                                : ""
                            }
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "endDate",
                                event.target.value,
                              )
                            }
                            className={`w-full rounded-xl border ${borderClass(
                              `experience.${index}.endDate`,
                            )} bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-[#F1F4F6] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={fieldErrors[`experience.${index}.endDate`]}
                          />
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium text-[#526170] sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={Boolean(item.currentlyWorking)}
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "currentlyWorking",
                                event.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-[#BFD5E5] text-[#0859A8] focus:ring-[#0859A8]"
                          />
                          I currently work here
                        </label>

                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-xs font-semibold text-[#68798A]">
                            Description
                          </label>

                          <textarea
                            rows={4}
                            data-field={`experience.${index}.description`}
                            value={item.description || ""}
                            onChange={(event) =>
                              updateExperience(
                                index,
                                "description",
                                event.target.value,
                              )
                            }
                            placeholder="Describe your responsibilities and achievements..."
                            className={`w-full resize-y rounded-xl border ${borderClass(
                              `experience.${index}.description`,
                            )} bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`experience.${index}.description`]
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 bg-white p-5 sm:flex-row sm:justify-end sm:p-8">
              <Link
                to="/jobseeker/profile"
                className="inline-flex items-center justify-center rounded-xl border border-[#D5E1EB] bg-white px-5 py-3 text-sm font-semibold text-[#526170] transition hover:border-[#BFD5E5] hover:bg-[#F8FBFD]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0859A8] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#064985] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobseekerProfileEdit;
