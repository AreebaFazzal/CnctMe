import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Globe2,
  ImagePlus,
  Loader2,
  MapPin,
  Factory,
  Users,
  X,
} from "lucide-react";

import {
  createCompany,
  updateCompany,
  selectCompanyLoading,
  selectCompanyError,
  clearCompanyError,
} from "../../features/companies/companiesSlice";

import getLogoSrc from "../../utils/logo";

const FIELD_KEYS = [
  "companyName",
  "website",
  "location",
  "industry",
  "companySize",
  "logo",
  "description",
];

const CompanyForm = ({ company = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectCompanyLoading);
  const rawError = useSelector(selectCompanyError);

  // Reference for scrolling to the first error
  const formRef = useRef(null);

  const error = useMemo(() => {
    if (!rawError) return null;

    if (typeof rawError === "string") {
      return { general: rawError };
    }

    const result = {};

    if (Array.isArray(rawError.errors)) {
      rawError.errors.forEach((item) => {
        const key = item.field || item.path || item.param;
        const msg = item.message || item.msg;

        if (key && FIELD_KEYS.includes(key)) {
          result[key] = msg;
        } else if (msg) {
          result.general = result.general || msg;
        }
      });
    }

    if (
      rawError.errors &&
      typeof rawError.errors === "object" &&
      !Array.isArray(rawError.errors)
    ) {
      Object.entries(rawError.errors).forEach(([key, value]) => {
        const msg = typeof value === "string" ? value : value?.message;

        if (FIELD_KEYS.includes(key)) {
          result[key] = msg;
        } else if (msg) {
          result.general = result.general || msg;
        }
      });
    }

    FIELD_KEYS.forEach((key) => {
      if (rawError[key]) {
        result[key] = rawError[key];
      }
    });

    const general = rawError.general || rawError.message;

    if (general && !result.general) {
      result.general = general;
    }

    if (Object.keys(result).length === 0) {
      result.general = "Something went wrong. Please try again.";
    }

    return result;
  }, [rawError]);

  const isEditMode = Boolean(company?._id);

  const [companyName, setCompanyName] = useState(company?.companyName || "");

  const [description, setDescription] = useState(company?.description || "");

  const [logo, setLogo] = useState(null);

  const [website, setWebsite] = useState(company?.website || "");

  const [location, setLocation] = useState(company?.location || "");

  const [industry, setIndustry] = useState(company?.industry || "");

  const [companySize, setCompanySize] = useState(company?.companySize || "");

  const [validationErrors, setValidationErrors] = useState({});

  const handleLogoChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setLogo(null);

      setValidationErrors((prev) => ({
        ...prev,
        logo: !isEditMode ? "Company logo is required." : "",
      }));

      return;
    }

    setLogo(selectedFile);

    setValidationErrors((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  const scrollToFirstError = (errors) => {
    const firstErrorField = FIELD_KEYS.find((field) => errors[field]);

    if (!firstErrorField) return;

    // Small delay allows React to render the error message first
    setTimeout(() => {
      const errorElement = document.getElementById(
        `company-field-${firstErrorField}`,
      );

      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Focus the field after scrolling
        const input = errorElement.querySelector("input, textarea");

        if (input) {
          input.focus();
        }
      }
    }, 50);
  };

  const validateForm = () => {
    const errors = {};

    const trimmedCompanyName = companyName.trim();
    const trimmedWebsite = website.trim();
    const trimmedLocation = location.trim();
    const trimmedIndustry = industry.trim();
    const trimmedCompanySize = companySize.trim();
    const trimmedDescription = description.trim();

    // Company Name
    if (!trimmedCompanyName) {
      errors.companyName = "Company name is required.";
    }

    // Website
    if (!trimmedWebsite) {
      errors.website = "Website is required.";
    } else {
      try {
        new URL(trimmedWebsite);
      } catch {
        errors.website =
          "Please enter a valid website URL, e.g. https://example.com";
      }
    }

    // Location
    if (!trimmedLocation) {
      errors.location = "Location is required.";
    }

    // Industry
    if (!trimmedIndustry) {
      errors.industry = "Industry is required.";
    }

    // Company Size
    if (!trimmedCompanySize) {
      errors.companySize = "Company size is required.";
    }

    // Logo
    if (!isEditMode && !logo && !company?.logo) {
      errors.logo = "Company logo is required.";
    }

    // Description
    if (!trimmedDescription) {
      errors.description = "Company description is required.";
    }

    setValidationErrors(errors);

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearCompanyError());

    // Frontend validation
    const errors = validateForm();

    // If validation fails, scroll to first error
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return;
    }

    const formData = new FormData();

    formData.append("companyName", companyName.trim());
    formData.append("description", description.trim());
    formData.append("website", website.trim());
    formData.append("location", location.trim());
    formData.append("industry", industry.trim());
    formData.append("companySize", companySize.trim());

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      if (isEditMode) {
        await dispatch(updateCompany(formData)).unwrap();
      } else {
        await dispatch(createCompany(formData)).unwrap();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Company form error:", err);
    }
  };

  const logoPreview = logo
    ? URL.createObjectURL(logo)
    : company?.logo
      ? getLogoSrc(company.logo)
      : null;

  return (
    <div className="min-w-0 rounded-2xl border border-[#E2E8F0] bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#0859A8]">
            {isEditMode ? "Company Settings" : "Get Started"}
          </p>

          <h2 className="mt-1 wrap-break-words text-lg font-bold text-[#25364A] sm:text-xl">
            {isEditMode ? "Edit Company Profile" : "Create Your Company"}
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            {isEditMode
              ? "Update your company information."
              : "Add your company information to start posting jobs."}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-[#8998A6] transition hover:bg-[#F1F5F9] hover:text-[#25364A] sm:self-auto"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* General Error */}
      {error?.general && (
        <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6 sm:mt-5">
          {error.general}
        </div>
      )}

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-4 sm:p-6"
        noValidate
      >
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {/* Company Name */}
          <div id="company-field-companyName" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Company Name
            </label>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8998A6]" />

              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);

                  setValidationErrors((prev) => ({
                    ...prev,
                    companyName: "",
                  }));
                }}
                placeholder="e.g. Tech Solutions"
                className="w-full min-w-0 rounded-lg border border-[#D7E1EA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            {(validationErrors.companyName || error?.companyName) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.companyName || error.companyName}
              </p>
            )}
          </div>

          {/* Website */}
          <div id="company-field-website" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Website
            </label>

            <div className="relative">
              <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8998A6]" />

              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);

                  setValidationErrors((prev) => ({
                    ...prev,
                    website: "",
                  }));
                }}
                placeholder="https://example.com"
                className="w-full min-w-0 rounded-lg border border-[#D7E1EA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            {(validationErrors.website || error?.website) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.website || error.website}
              </p>
            )}
          </div>

          {/* Location */}
          <div id="company-field-location" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Location
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8998A6]" />

              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);

                  setValidationErrors((prev) => ({
                    ...prev,
                    location: "",
                  }));
                }}
                placeholder="e.g. Karachi, Pakistan"
                className="w-full min-w-0 rounded-lg border border-[#D7E1EA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            {(validationErrors.location || error?.location) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.location || error.location}
              </p>
            )}
          </div>

          {/* Industry */}
          <div id="company-field-industry" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Industry
            </label>

            <div className="relative">
              <Factory className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8998A6]" />

              <input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);

                  setValidationErrors((prev) => ({
                    ...prev,
                    industry: "",
                  }));
                }}
                placeholder="e.g. Information Technology"
                className="w-full min-w-0 rounded-lg border border-[#D7E1EA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            {(validationErrors.industry || error?.industry) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.industry || error.industry}
              </p>
            )}
          </div>

          {/* Company Size */}
          <div id="company-field-companySize" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="companySize"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Company Size
            </label>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8998A6]" />

              <input
                id="companySize"
                type="text"
                value={companySize}
                onChange={(e) => {
                  setCompanySize(e.target.value);

                  setValidationErrors((prev) => ({
                    ...prev,
                    companySize: "",
                  }));
                }}
                placeholder="e.g. 51-200 employees"
                className="w-full min-w-0 rounded-lg border border-[#D7E1EA] bg-white py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            {(validationErrors.companySize || error?.companySize) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.companySize || error.companySize}
              </p>
            )}
          </div>

          {/* Logo */}
          <div id="company-field-logo" className="min-w-0 scroll-mt-24">
            <label
              htmlFor="logo"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Company Logo
              {!isEditMode && <span className="ml-1 text-red-500">*</span>}
            </label>

            <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
              {/* Preview */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D7E1EA] bg-[#F8FAFC]">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-[#8998A6]" />
                )}
              </div>

              {/* File Input */}
              <div className="min-w-0 w-full flex-1">
                <input
                  id="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleLogoChange}
                  className="block w-full min-w-0 cursor-pointer overflow-hidden rounded-lg border border-[#D7E1EA] bg-white text-xs text-[#52606D] file:mr-2 file:border-0 file:bg-[#E6EFF8] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-[#0859A8] hover:file:bg-[#DCEAF7] sm:text-sm sm:file:mr-4 sm:file:px-4 sm:file:text-sm"
                />

                <p className="mt-1.5 text-xs text-[#8998A6]">
                  PNG, JPG, JPEG or WEBP
                </p>
              </div>
            </div>

            {(validationErrors.logo || error?.logo) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.logo || error.logo}
              </p>
            )}
          </div>

          {/* Description */}
          <div
            id="company-field-description"
            className="min-w-0 scroll-mt-24 lg:col-span-2"
          >
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-[#25364A]"
            >
              Company Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);

                setValidationErrors((prev) => ({
                  ...prev,
                  description: "",
                }));
              }}
              placeholder="Tell candidates about your company..."
              rows={6}
              className="w-full min-w-0 resize-none rounded-lg border border-[#D7E1EA] bg-white px-3 py-2.5 text-sm leading-6 text-[#25364A] outline-none transition placeholder:text-[#A0ACB8] focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
            />

            {(validationErrors.description || error?.description) && (
              <p className="mt-1.5 text-xs text-red-500">
                {validationErrors.description || error.description}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:mt-8 sm:flex-row sm:justify-end sm:pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full rounded-lg border border-[#D7E1EA] bg-white px-5 py-2.5 text-sm font-semibold text-[#52606D] transition hover:border-[#AAB8C5] hover:text-[#25364A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064A8D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Company"
                : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
