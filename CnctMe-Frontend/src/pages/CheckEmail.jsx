import { Link, useLocation } from "react-router-dom";

import AuthNavbar from "../components/auth/AuthNavbar";
import AuthFooter from "../components/auth/AuthFooter";

const CheckEmail = () => {
  const location = useLocation();

  const email = location.state?.email;
  const type = location.state?.type;

  const isPasswordReset = type === "password-reset";

  const defaultMessage = isPasswordReset
    ? "If an account exists with this email, a password reset link has been sent."
    : "We have sent a verification link to your email address.";

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0]">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#DCE3E8] bg-white p-6 text-center shadow-[0_8px_30px_rgba(37,54,74,0.06)] sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0859A8]/10 text-3xl">
            ✉
          </div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0859A8]">
            {isPasswordReset ? "Password recovery" : "Email verification"}
          </div>

          <h1 className="text-2xl font-bold text-[#25364A]">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {location.state?.message || defaultMessage}
          </p>

          {email && (
            <div className="mt-4 rounded-xl bg-[#F3F2F0] px-4 py-3">
              <p className="break-all text-sm font-semibold text-[#0859A8]">
                {email}
              </p>
            </div>
          )}

          {isPasswordReset ? (
            <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-left">
              <p className="text-xs leading-5 text-[#25364A]">
                Check your inbox and click the password reset link. For
                security, the link expires after 15 minutes.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Open your email and click the verification link to activate your
                CnctMe account.
              </p>

              <Link
                to="/resend-verification"
                className="mt-4 inline-block text-sm font-semibold text-[#0859A8] hover:underline"
              >
                Didn't receive the email? Resend it
              </Link>
            </>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#0859A8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064B8F]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default CheckEmail;
