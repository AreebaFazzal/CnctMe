import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";

import {
  getRecruiterProfile,
  updateRecruiterSettings,
  changeRecruiterPassword,
  deleteRecruiterAccount,
  selectRecruiterSettings,
  selectRecruiterSettingsUpdating,
  selectPasswordChanging,
  selectAccountDeleting,
  selectRecruiterProfileLoading,
} from "../../features/recruiter/recruiterSlice";

import { logout } from "../../features/auth/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileLoading = useSelector(selectRecruiterProfileLoading);

  const settings = useSelector(selectRecruiterSettings);
  const settingsUpdating = useSelector(selectRecruiterSettingsUpdating);

  const passwordChanging = useSelector(selectPasswordChanging);

  const accountDeleting = useSelector(selectAccountDeleting);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // GET PROFILE / SETTINGS
  useEffect(() => {
    dispatch(getRecruiterProfile());
  }, [dispatch]);

  // UPDATE NOTIFICATION
  const handleSettingChange = async (field) => {
    const currentValue = settings?.[field] !== false;
    const newValue = !currentValue;

    setError("");
    setMessage("");

    try {
      await dispatch(
        updateRecruiterSettings({
          [field]: newValue,
        }),
      ).unwrap();

      setMessage("Notification settings updated.");
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.general || "Unable to update notification settings.",
      );
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await dispatch(
        changeRecruiterPassword({
          currentPassword,
          newPassword,
        }),
      ).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully. Please log in again.");

      setTimeout(() => {
        dispatch(logout());
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.general || "Unable to change your password.",
      );
    }
  };

  // OPEN DELETE CONFIRMATION
  const handleDeleteAccount = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (deleteConfirmation !== "DELETE") {
      setError(
        "Please type DELETE exactly to permanently delete your account.",
      );
      return;
    }

    setShowDeleteModal(true);
  };

  // CONFIRM DELETE ACCOUNT
  const confirmDeleteAccount = async () => {
    setError("");

    try {
      await dispatch(deleteRecruiterAccount("DELETE")).unwrap();

      setShowDeleteModal(false);

      dispatch(logout());

      navigate("/login");
    } catch (err) {
      setShowDeleteModal(false);

      setError(
        typeof err === "string"
          ? err
          : err?.general || "Unable to delete your account.",
      );
    }
  };

  // NOTIFICATION VALUES
  const emailNotifications = settings?.emailNotifications !== false;

  const applicationNotifications = settings?.applicationNotifications !== false;

  const interviewNotifications = settings?.interviewNotifications !== false;

  // LOADING
  if (profileLoading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <div className="animate-pulse space-y-5 sm:space-y-6">
              <div className="h-7 w-36 rounded bg-[#E6EFF8] sm:w-40" />
              <div className="h-24 rounded-xl bg-[#EEF2F5]" />
              <div className="h-40 rounded-xl bg-[#EEF2F5]" />
              <div className="h-40 rounded-xl bg-[#EEF2F5]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div>
            <h1 className="text-xl font-bold text-[#25364A] sm:text-2xl">
              Settings
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#68798A] sm:text-sm">
              Manage your notifications, security, and account.
            </p>
          </div>

          {/* ==================================================
              ALERTS
          ================================================== */}

          {error && (
            <div className="wrap-break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-[#D64545] sm:px-5 sm:py-4 sm:text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="wrap-break-words rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium leading-5 text-green-700 sm:px-5 sm:py-4 sm:text-sm">
              {message}
            </div>
          )}

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#DCE3E8] bg-white shadow-sm">
            <div className="border-b border-[#E8EDF1] p-4 sm:p-5 md:p-7">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8] sm:h-10 sm:w-10">
                  <Bell size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Notifications
                  </h2>

                  <p className="mt-0.5 wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                    Choose which notifications you want to receive.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#E8EDF1]">
              {/* EMAIL */}
              <div className="flex min-w-0 items-start justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-7">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <Mail size={20} className="mt-0.5 shrink-0 text-[#68798A]" />

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5 text-[#25364A]">
                      Email Notifications
                    </h3>

                    <p className="mt-1 max-w-2xl wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                      Receive emails about application and interview events.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSettingChange("emailNotifications")}
                  disabled={settingsUpdating}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
                    emailNotifications ? "bg-[#0859A8]" : "bg-[#CBD5DF]"
                  }`}
                  aria-label="Toggle email notifications"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      emailNotifications ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* APPLICATION */}
              <div className="flex min-w-0 items-start justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-7">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <BriefcaseBusiness
                    size={20}
                    className="mt-0.5 shrink-0 text-[#68798A]"
                  />

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5 text-[#25364A]">
                      Application Notifications
                    </h3>

                    <p className="mt-1 max-w-2xl wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                      Get notified about new applications and application status
                      updates.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange("applicationNotifications")
                  }
                  disabled={settingsUpdating}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
                    applicationNotifications ? "bg-[#0859A8]" : "bg-[#CBD5DF]"
                  }`}
                  aria-label="Toggle application notifications"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      applicationNotifications ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* INTERVIEW */}
              <div className="flex min-w-0 items-start justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 md:px-7">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <CalendarDays
                    size={20}
                    className="mt-0.5 shrink-0 text-[#68798A]"
                  />

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5 text-[#25364A]">
                      Interview Notifications
                    </h3>

                    <p className="mt-1 max-w-2xl wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                      Get notified about scheduled, updated, and cancelled
                      interviews.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSettingChange("interviewNotifications")}
                  disabled={settingsUpdating}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
                    interviewNotifications ? "bg-[#0859A8]" : "bg-[#CBD5DF]"
                  }`}
                  aria-label="Toggle interview notifications"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      interviewNotifications ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================
              SECURITY
          ================================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#DCE3E8] bg-white shadow-sm">
            <div className="border-b border-[#E8EDF1] p-4 sm:p-5 md:p-7">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8] sm:h-10 sm:w-10">
                  <ShieldCheck size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Security
                  </h2>

                  <p className="mt-0.5 wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                    Keep your recruiter account secure.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-4 sm:p-5 md:p-7">
              <div className="mb-5 flex min-w-0 items-start gap-3 sm:mb-6 sm:gap-4">
                <Lock size={20} className="mt-0.5 shrink-0 text-[#68798A]" />

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#25364A]">
                    Change Password
                  </h3>

                  <p className="mt-1 wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                    Update your password to keep your account protected.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* CURRENT PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#25364A] sm:text-sm">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full min-w-0 rounded-lg border border-[#C8D5E0] bg-white px-4 py-3 pr-11 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
                      placeholder="Enter current password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A96A3] transition hover:text-[#52606D]"
                      aria-label="Show or hide current password"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#25364A] sm:text-sm">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full min-w-0 rounded-lg border border-[#C8D5E0] bg-white px-4 py-3 pr-11 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A96A3] transition hover:text-[#52606D]"
                      aria-label="Show or hide new password"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#25364A] sm:text-sm">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full min-w-0 rounded-lg border border-[#C8D5E0] bg-white px-4 py-3 pr-11 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8]"
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A96A3] transition hover:text-[#52606D]"
                      aria-label="Show or hide confirmed password"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-stretch sm:justify-end">
                  <button
                    type="submit"
                    disabled={passwordChanging}
                    className="w-full rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064A8E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {passwordChanging ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* ==================================================
              DANGER ZONE
          ================================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50/50 p-4 sm:p-5 md:p-7">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[#D64545] sm:h-10 sm:w-10">
                  <Trash2 size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#D64545] sm:text-lg">
                    Danger Zone
                  </h2>

                  <p className="mt-0.5 wrap-break-words text-xs leading-5 text-[#8A96A3] sm:text-sm">
                    Permanent account actions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-7">
              <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#25364A]">
                    Permanently Delete Account
                  </h3>

                  <p className="mt-1 max-w-2xl wrap-break-words text-xs leading-6 text-[#8A96A3] sm:text-sm">
                    Permanently delete your recruiter account, jobs,
                    applications associated with those jobs, interviews,
                    company, notifications, and account data. This action cannot
                    be undone.
                  </p>
                </div>

                <form
                  onSubmit={handleDeleteAccount}
                  className="w-full shrink-0 lg:w-80"
                >
                  <label className="mb-2 block text-xs font-semibold text-[#52606D]">
                    Type DELETE to confirm
                  </label>

                  <div className="flex min-w-0 gap-2">
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      className="min-w-0 flex-1 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm text-[#25364A] outline-none focus:border-[#D64545] focus:ring-2 focus:ring-red-100 sm:px-4"
                    />

                    <button
                      type="submit"
                      disabled={
                        accountDeleting || deleteConfirmation !== "DELETE"
                      }
                      className="shrink-0 rounded-lg bg-[#D64545] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B83232] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                    >
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#25364A]/50 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#DCE3E8] bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-[#E8EDF1] px-5 py-5 sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#D64545]">
                  <AlertTriangle size={20} />
                </div>

                <div className="min-w-0">
                  <h2
                    id="delete-account-title"
                    className="text-base font-bold text-[#25364A] sm:text-lg"
                  >
                    Delete account?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#8A96A3] sm:text-sm">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={accountDeleting}
                className="ml-3 shrink-0 rounded-lg p-1.5 text-[#8A96A3] transition hover:bg-[#F3F2F0] hover:text-[#25364A] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="px-5 py-5 sm:px-6">
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="text-sm leading-6 text-[#52606D]">
                  You are about to permanently delete your recruiter account and
                  its associated data, including your jobs, company,
                  applications, interviews, notifications, and account data.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#8A96A3]">
                Your account will be removed permanently and you will be signed
                out.
              </p>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#E8EDF1] bg-[#FAFBFC] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={accountDeleting}
                className="w-full rounded-lg border border-[#C8D5E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#52606D] transition hover:bg-[#F3F2F0] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteAccount}
                disabled={accountDeleting}
                className="w-full rounded-lg bg-[#D64545] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B83232] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {accountDeleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
