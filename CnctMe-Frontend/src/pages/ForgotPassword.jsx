import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import getApiError from "../utils/apiError";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthFooter from "../components/auth/AuthFooter";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError({});
    setLoading(true);

    try {
      const response = await api.post("/users/forgot-password", {
        email,
      });

      navigate("/check-email", {
        state: {
          email,
          type: "password-reset",
          message:
            response.data.message ||
            "If an account exists with this email, a password reset link has been sent.",
        },
      });
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0]">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#DCE3E8] bg-white p-6 shadow-[0_8px_30px_rgba(37,54,74,0.06)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0859A8]/10 text-2xl">
              🔐
            </div>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0859A8]">
              Account recovery
            </div>

            <h1 className="text-2xl font-bold text-[#25364A]">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your email address and we'll send you a secure password
              reset link.
            </p>
          </div>

          {error.general && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#CF0007]">
              {error.general}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error.email}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
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
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default ForgotPassword;
