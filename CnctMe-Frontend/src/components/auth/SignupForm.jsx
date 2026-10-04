import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  selectAuthError,
  selectAuthLoading,
} from "../../features/auth/authSlice";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import AuthNavbar from "./AuthNavbar";
import AuthFooter from "./AuthFooter";

const SignupForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);

  const error = useSelector(selectAuthError);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("");

  const roleOptions = [
    {
      value: "jobseeker",
      label: "Job Seeker",
    },
    {
      value: "recruiter",
      label: "Recruiter",
    },
  ];

  // Signup
  const handleSignupForm = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/check-email", {
        state: {
          email,
        },
      });
    } else {
      setPassword("");

      setConfirmPassword("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0]">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-2xl border border-[#DCE3E8] bg-white p-5 shadow-[0_8px_30px_rgba(37,54,74,0.06)] sm:p-7">
          {/* Heading */}

          <div className="mb-4">
            <div className="mb-2 inline-flex rounded-full bg-[#0859A8]/10 px-3 py-1 text-xs font-semibold text-[#0859A8]">
              Join CnctMe
            </div>

            <h1 className="text-2xl font-bold leading-tight text-[#25364A] sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-1.5 text-sm leading-5 text-gray-500">
              Start your journey toward better career opportunities.
            </p>
          </div>

          {/* General Error */}

          {error?.general && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm leading-5 text-[#CF0007]">
              {error.general}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSignupForm} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={error?.firstName}
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={error?.lastName}
                required
              />
            </div>

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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error?.password}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={error?.confirmPassword}
                required
              />
            </div>

            <Select
              label="Account Type"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={roleOptions}
              placeholder="Select account type"
              error={error?.role}
              required
            />

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 border-t border-[#DCE3E8] pt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0859A8] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default SignupForm;
