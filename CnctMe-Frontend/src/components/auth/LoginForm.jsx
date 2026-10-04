import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  loginUser,
  selectAuthError,
  selectAuthLoading,
} from "../../features/auth/authSlice";

import Button from "../ui/Button";
import Input from "../ui/Input";

import AuthNavbar from "./AuthNavbar";
import AuthFooter from "./AuthFooter";

const LoginForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const loading = useSelector(selectAuthLoading);

  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // Success Message
  const successMessage = location.state?.message;

  useEffect(() => {
    if (successMessage) {
      window.history.replaceState({}, document.title);
    }
  }, [successMessage]);

  // Login
  const handleLoginForm = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/jobs");
    } else {
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0]">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-2xl border border-[#DCE3E8] bg-white p-6 shadow-[0_8px_30px_rgba(37,54,74,0.06)] sm:p-8">
          {/* Heading */}

          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full bg-[#0859A8]/10 px-3 py-1 text-xs font-semibold text-[#0859A8]">
              Welcome back
            </div>

            <h1 className="text-2xl font-bold leading-tight text-[#25364A] sm:text-3xl">
              Log in to CnctMe
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Access your account and continue your journey.
            </p>
          </div>

          {/* Success Message */}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
              {successMessage}
            </div>
          )}

          {/* General Error */}

          {error?.general && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-[#CF0007]">
              {error.general}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleLoginForm} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error?.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error?.password}
              required
            />

            {/* Links */}

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link
                to="/forgot-password"
                className="font-semibold text-[#0859A8] transition hover:text-[#064B8F] hover:underline"
              >
                Forgot Password?
              </Link>

              <Link
                to="/resend-verification"
                className="font-semibold text-[#0859A8] transition hover:text-[#064B8F] hover:underline"
              >
                Resend Verification
              </Link>
            </div>

            {/* Button */}

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Divider */}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#DCE3E8]" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="h-px flex-1 bg-[#DCE3E8]" />
          </div>

          {/* Signup Link */}

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#0859A8] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default LoginForm;
