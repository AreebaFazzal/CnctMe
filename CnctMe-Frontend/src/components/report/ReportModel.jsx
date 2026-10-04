import { useEffect, useRef, useState } from "react";
import {
  X,
  Flag,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Check,
} from "lucide-react";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

const REPORT_REASONS = [
  "Fraud or scam",
  "Fake or misleading information",
  "Inappropriate content",
  "Harassment or abusive behavior",
  "Spam",
  "Job posting issue",
  "Other",
];

const ReportModal = ({
  isOpen,
  onClose,
  reportedUser = null,
  job = null,
  company = null,
  title = "Report",
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);

  const reasonDropdownRef = useRef(null);

  // GET ID
  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
      return value;
    }

    return value?._id || value?.id || null;
  };

  // RESET FORM
  const resetForm = () => {
    setReason("");
    setDescription("");
    setLoading(false);
    setSuccess(false);
    setError("");
    setReasonOpen(false);
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason);
    setReasonOpen(false);

    if (error) {
      setError("");
    }
  };

  // SAFE ERROR MESSAGE
  const getSafeErrorMessage = (err) => {
    try {
      const message = getApiError(err);

      if (typeof message === "string" && message.trim()) {
        return message;
      }

      if (message && typeof message === "object") {
        if (typeof message.message === "string" && message.message.trim()) {
          return message.message;
        }

        if (typeof message.error === "string" && message.error.trim()) {
          return message.error;
        }

        if (typeof message.general === "string" && message.general.trim()) {
          return message.general;
        }
      }
    } catch (error) {
      console.error("getApiError failed:", error);
    }

    const responseMessage = err?.response?.data?.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    const responseError = err?.response?.data?.error;

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (typeof err?.message === "string" && err.message.trim()) {
      return err.message;
    }

    return "Something went wrong while submitting the report. Please try again.";
  };

  // SUBMIT REPORT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setReasonOpen(false);

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      setError("Please describe the issue.");
      return;
    }

    if (trimmedDescription.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    if (trimmedDescription.length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        reason: reason.trim(),
        description: trimmedDescription,
      };

      const reportedUserId = getId(reportedUser);
      const jobId = getId(job);
      const companyId = getId(company);

      if (reportedUserId) {
        payload.reportedUser = reportedUserId;
      } else if (jobId) {
        payload.job = jobId;
      } else if (companyId) {
        payload.company = companyId;
      } else {
        setError("No report target was provided.");
        setLoading(false);
        return;
      }

      await api.post("/reports", payload);

      setError("");
      setSuccess(true);
    } catch (err) {
      console.error("Report submission failed:", err);

      setSuccess(false);
      setError(getSafeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reasonDropdownRef.current &&
        !reasonDropdownRef.current.contains(event.target)
      ) {
        setReasonOpen(false);
      }
    };

    if (reasonOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reasonOpen]);

  // CLOSE DROPDOWN WITH ESCAPE
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setReasonOpen(false);
      }
    };

    if (reasonOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [reasonOpen]);

  // PREVENT BODY SCROLL WHILE MODAL IS OPEN
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // UI
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/50 px-3 py-4 sm:px-4 sm:py-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
              <Flag className="h-5 w-5 text-red-600" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-[#25364A]">
                {title}
              </h2>

              <p className="text-xs leading-5 text-slate-500 sm:text-sm">
                Help us understand the issue
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================== */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================== */}

        <div className="min-h-0 overflow-y-auto">
          {/* ================================================== */}
          {/* SUCCESS */}
          {/* ================================================== */}

          {success ? (
            <div className="px-4 py-7 text-center sm:px-6 sm:py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-[#25364A]">
                Report submitted
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Thank you for reporting this issue. Our admin team will review
                your report.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-6 w-full rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#074d91] sm:w-auto"
              >
                Done
              </button>
            </div>
          ) : (
            /* ================================================== */
            /* FORM */
            /* ================================================== */

            <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-6 sm:py-5">
              {/* ================================================== */}
              {/* ERROR */}
              {/* ================================================== */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3 sm:px-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                  <p className="wrap-break-words text-sm leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* ================================================== */}
              {/* REASON */}
              {/* ================================================== */}

              <div ref={reasonDropdownRef} className="relative min-w-0">
                <label
                  htmlFor="report-reason"
                  className="mb-2 block text-sm font-medium text-[#25364A]"
                >
                  Reason
                </label>

                {/* CUSTOM DROPDOWN BUTTON */}

                <button
                  id="report-reason"
                  type="button"
                  disabled={loading}
                  onClick={() => setReasonOpen((prev) => !prev)}
                  className={`flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg border bg-white px-3 text-left text-sm outline-none transition ${
                    reasonOpen
                      ? "border-[#0859A8] ring-2 ring-[#0859A8]/10"
                      : "border-slate-300"
                  } ${
                    loading
                      ? "cursor-not-allowed bg-slate-50 opacity-70"
                      : "hover:border-slate-400"
                  }`}
                >
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      reason ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {reason || "Select a reason"}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      reasonOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* CUSTOM DROPDOWN MENU */}

                {reasonOpen && !loading && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    <div className="max-h-56 overflow-y-auto p-1 sm:max-h-64">
                      {REPORT_REASONS.map((item) => {
                        const isSelected = reason === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleReasonSelect(item)}
                            className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                              isSelected
                                ? "bg-[#E6EFF8] text-[#0859A8]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="min-w-0 wrap-break-words">
                              {item}
                            </span>

                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-[#0859A8]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ================================================== */}
              {/* DESCRIPTION */}
              {/* ================================================== */}

              <div className="mt-5 min-w-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="report-description"
                    className="block text-sm font-medium text-[#25364A]"
                  >
                    Description
                  </label>

                  <span className="shrink-0 text-xs text-slate-400">
                    {description.length}/2000
                  </span>
                </div>

                <textarea
                  id="report-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  maxLength={2000}
                  rows={5}
                  placeholder="Please explain what happened..."
                  className="block w-full min-w-0 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10 disabled:bg-slate-50"
                />
              </div>

              {/* ================================================== */}
              {/* ACTIONS */}
              {/* ================================================== */}

              <div className="mt-5 flex flex-col-reverse gap-2.5 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#074d91] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
