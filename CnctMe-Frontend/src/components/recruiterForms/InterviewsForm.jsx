import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { createInterview } from "../../features/recruiter/recruiterSlice";

const InterviewsForm = ({ applicationId, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});

  const [error, setError] = useState("");

  const formRef = useRef(null);

  const validateForm = () => {
    const errors = {};

    if (!interviewDate) {
      errors.interviewDate = "Interview date is required.";
    }
    if (!interviewTime) {
      errors.interviewTime = "Interview time is required.";
    }
    if (!meetingLink.trim()) {
      errors.meetingLink = "Meeting link is required.";
    } else {
      try {
        new URL(meetingLink.trim());
      } catch {
        errors.meetingLink =
          "Please enter a valid meeting link, e.g. https://meet.google.com/...";
      }
    }

    setFieldErrors(errors);

    return errors;
  };

  const scrollToFirstError = (errors) => {
    const fieldOrder = ["interviewDate", "interviewTime", "meetingLink"];

    const firstErrorField = fieldOrder.find((field) => errors[field]);

    if (!firstErrorField) {
      return;
    }

    setTimeout(() => {
      const errorElement = document.getElementById(
        `interview-field-${firstErrorField}`,
      );

      if (!errorElement) {
        return;
      }

      errorElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const input = errorElement.querySelector("input");

      if (input) {
        input.focus();
      }
    }, 50);
  };

  const handleInterviewsForm = async (event) => {
    event.preventDefault();

    setError("");

    if (!applicationId) {
      setError("Application ID is missing.");
      return;
    }

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        createInterview({
          applicationId,
          date: interviewDate,
          time: interviewTime,
          meetingLink: meetingLink.trim(),
        }),
      ).unwrap();

      setInterviewDate("");
      setInterviewTime("");
      setMeetingLink("");

      setFieldErrors({});
      setError("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(
        error?.message ||
          error?.general ||
          "Unable to schedule the interview. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleInterviewsForm}
      className="min-w-0 rounded-2xl border border-[#E6EFF8] bg-white p-4 shadow-sm sm:p-6"
      noValidate
    >
      <div className="mb-5 sm:mb-6">
        <h2 className="text-lg font-semibold text-[#25364A]">
          Schedule Interview
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
          Schedule an interview with this candidate.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm leading-relaxed text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Interview Date */}

        <div
          id="interview-field-interviewDate"
          className="min-w-0 scroll-mt-24"
        >
          <label
            htmlFor="interviewDate"
            className="mb-2 block text-sm font-medium text-[#25364A]"
          >
            Interview Date
          </label>

          <input
            id="interviewDate"
            type="date"
            value={interviewDate}
            onChange={(event) => {
              setInterviewDate(event.target.value);

              setFieldErrors((prev) => ({
                ...prev,
                interviewDate: "",
              }));

              setError("");
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full min-w-0 rounded-lg border border-[#DCE3E8] bg-white px-3 py-2.5 text-sm text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
          />

          {fieldErrors.interviewDate && (
            <p className="mt-1.5 text-xs text-red-500">
              {fieldErrors.interviewDate}
            </p>
          )}
        </div>

        {/* Interview Time */}

        <div
          id="interview-field-interviewTime"
          className="min-w-0 scroll-mt-24"
        >
          <label
            htmlFor="interviewTime"
            className="mb-2 block text-sm font-medium text-[#25364A]"
          >
            Interview Time
          </label>

          <input
            id="interviewTime"
            type="time"
            value={interviewTime}
            onChange={(event) => {
              setInterviewTime(event.target.value);

              setFieldErrors((prev) => ({
                ...prev,
                interviewTime: "",
              }));

              setError("");
            }}
            className="w-full min-w-0 rounded-lg border border-[#DCE3E8] bg-white px-3 py-2.5 text-sm text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
          />

          {fieldErrors.interviewTime && (
            <p className="mt-1.5 text-xs text-red-500">
              {fieldErrors.interviewTime}
            </p>
          )}
        </div>

        {/* Meeting Link */}

        <div id="interview-field-meetingLink" className="min-w-0 scroll-mt-24">
          <label
            htmlFor="meetingLink"
            className="mb-2 block text-sm font-medium text-[#25364A]"
          >
            Meeting Link
          </label>

          <input
            id="meetingLink"
            type="url"
            value={meetingLink}
            onChange={(event) => {
              setMeetingLink(event.target.value);

              setFieldErrors((prev) => ({
                ...prev,
                meetingLink: "",
              }));

              setError("");
            }}
            placeholder="https://meet.google.com/..."
            className="w-full min-w-0 rounded-lg border border-[#DCE3E8] bg-white px-3 py-2.5 text-sm text-[#25364A] outline-none transition placeholder:text-[#A0AAB4] focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
          />

          {fieldErrors.meetingLink && (
            <p className="mt-1.5 text-xs text-red-500">
              {fieldErrors.meetingLink}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="w-full rounded-lg border border-[#DCE3E8] bg-white px-4 py-2.5 text-sm font-medium text-[#52606D] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#064A8D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}

          {submitting ? "Scheduling..." : "Schedule Interview"}
        </button>
      </div>
    </form>
  );
};

export default InterviewsForm;
