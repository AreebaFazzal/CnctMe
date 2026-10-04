import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import api from "../api/axios";

const CompanyRequiredRoute = () => {
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [companyStatus, setCompanyStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const checkCompany = async () => {
      if (!isAuthenticated || user?.role !== "recruiter") {
        if (isMounted) {
          setCompanyStatus("missing");
        }

        return;
      }

      try {
        const response = await api.get("/companies/my");

        if (!isMounted) return;

        if (response.data?.companyInfo) {
          setCompanyStatus("exists");
        } else {
          setCompanyStatus("missing");
        }
      } catch (error) {
        if (!isMounted) return;

        // 404 means recruiter has not created a company
        if (error.response?.status === 404) {
          setCompanyStatus("missing");
        } else {
          setCompanyStatus("error");
        }
      }
    };

    checkCompany();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.role]);

  // NOT AUTHENTICATED
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // NOT A RECRUITER
  if (user?.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  // CHECKING COMPANY
  if (companyStatus === "checking") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header skeleton */}
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E6EFF8]" />

            <div className="h-10 w-32 animate-pulse rounded-lg bg-[#E6EFF8]" />
          </div>

          {/* Main content skeleton */}
          <div className="rounded-2xl border border-[#E6EFF8] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse rounded-xl bg-[#E6EFF8]" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 animate-pulse rounded-md bg-[#E6EFF8]" />
                <div className="h-4 w-32 animate-pulse rounded-md bg-[#E6EFF8]" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-4 w-32 animate-pulse rounded-md bg-[#E6EFF8]" />

              <div className="h-11 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />

              <div className="h-4 w-40 animate-pulse rounded-md bg-[#E6EFF8]" />

              <div className="h-11 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="h-11 animate-pulse rounded-lg bg-[#E6EFF8]" />
                <div className="h-11 animate-pulse rounded-lg bg-[#E6EFF8]" />
              </div>

              <div className="h-24 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPANY DOES NOT EXIST
  if (companyStatus === "missing") {
    return (
      <Navigate
        to="/recruiter/company"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // ERROR CHECKING COMPANY
  if (companyStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-[#25364A]">
            Unable to check company profile
          </h2>

          <p className="text-sm text-[#7A8793]">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  // COMPANY EXISTS
  return <Outlet />;
};

export default CompanyRequiredRoute;
