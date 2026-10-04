import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/axios";
import getApiError from "../utils/apiError";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthNavbar from "../components/auth/AuthNavbar";
import AuthFooter from "../components/auth/AuthFooter";

const VerifyEmail = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api.get(`/users/verify-email/${token}`, {
          signal: controller.signal,
        });

        setStatus("success");

        setMessage(
          response.data.message || "Your email has been verified successfully.",
        );
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or has expired.",
        );
      }
    };

    verifyEmail();

    return () => {
      controller.abort();
    };
  }, [token]);

  const handleResendVerification = async (e) => {
    e.preventDefault();

    setResending(true);
    setResendMessage("");
    setResendError({});

    try {
      const response = await api.post("/users/resend-verification", {
        email,
      });

      setResendMessage(
        response.data.message || "A new verification email has been sent.",
      );

      setEmail("");
    } catch (error) {
      setResendError(getApiError(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0]">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#DCE3E8] bg-white p-6 shadow-[0_8px_30px_rgba(37,54,74,0.06)] sm:p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-4 border-[#0859A8]/20 border-t-[#0859A8]" />

              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0859A8]">
                Account verification
              </div>

              <h1 className="text-2xl font-bold text-[#25364A]">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl text-green-600">
                ✓
              </div>

              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-600">
                Verification complete
              </div>

              <h1 className="text-2xl font-bold text-[#25364A]">
                Email verified!
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>

              <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#0859A8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064B8F]"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <>
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl text-red-600">
                  !
                </div>

                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-600">
                  Verification failed
                </div>

                <h1 className="text-2xl font-bold text-[#25364A]">
                  Unable to verify email
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {message}
                </p>
              </div>

              <form
                onSubmit={handleResendVerification}
                className="mt-6 space-y-4"
              >
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={resendError.email}
                  required
                />

                {resendError.general && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#CF0007]">
                    {resendError.general}
                  </div>
                )}

                {resendMessage && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {resendMessage}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={resending}>
                  {resending ? "Sending..." : "Resend Verification Email"}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#0859A8] hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default VerifyEmail;
