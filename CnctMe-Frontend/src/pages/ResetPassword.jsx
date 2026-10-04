import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import getApiError from "../utils/apiError";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthNavbar from "../components/auth/AuthNavbar";
import AuthFooter from "../components/auth/AuthFooter";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError({});

    if (!token) {
      setError({
        general: "Password reset token is missing or invalid.",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/reset-password", {
        token,
        password,
        confirmPassword,
      });

      navigate("/login", {
        state: {
          message:
            response.data.message ||
            "Password reset successfully. Please log in again.",
        },
      });
    } catch (error) {
      setError(getApiError(error));

      setPassword("");
      setConfirmPassword("");
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
              🔑
            </div>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0859A8]">
              Account security
            </div>

            <h1 className="text-2xl font-bold text-[#25364A]">
              Create a new password
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Choose a strong password to secure your CnctMe account.
            </p>
          </div>

          {error.general && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-[#CF0007]">
              {error.general}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error.confirmPassword}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
