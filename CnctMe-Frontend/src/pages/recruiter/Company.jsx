import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Globe2,
  MapPin,
  Pencil,
  Users,
  Factory,
  Plus,
  ArrowUpRight,
  X,
} from "lucide-react";

import {
  fetchMyCompany,
  selectCurrentCompany,
  selectCompanyLoading,
  selectCompanyError,
  clearCurrentCompany,
  clearCompanyError,
} from "../../features/companies/companiesSlice";

import CompanyForm from "../../components/recruiterForms/CompanyForm";
import getLogoSrc from "../../utils/logo";
import getWebsiteUrl from "../../utils/website";

const Company = () => {
  const dispatch = useDispatch();

  const company = useSelector(selectCurrentCompany);
  const loading = useSelector(selectCompanyLoading);
  const error = useSelector(selectCompanyError);

  const [showForm, setShowForm] = useState(false);
  const [companyNotFound, setCompanyNotFound] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  // LOAD COMPANY
  useEffect(() => {
    dispatch(clearCurrentCompany());

    dispatch(fetchMyCompany())
      .unwrap()
      .then(() => {
        setCompanyNotFound(false);
      })
      .catch((error) => {
        const message =
          typeof error === "string" ? error : error?.general || "";

        if (message.toLowerCase().includes("haven't created a company")) {
          setCompanyNotFound(true);
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (!showLogoModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLogoModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showLogoModal]);

  // FORM SUCCESS
  const handleFormSuccess = () => {
    setShowForm(false);
    setCompanyNotFound(false);
  };

  // OPEN CREATE FORM
  const handleCreate = () => {
    dispatch(clearCompanyError());
    setShowForm(true);
  };

  // EDIT COMPANY
  const handleEdit = () => {
    dispatch(clearCompanyError());
    setShowForm(true);
  };

  // CLOSE FORM
  const handleCancel = () => {
    dispatch(clearCompanyError());
    setShowForm(false);
  };

  // COMPANY LOGO
  const companyLogo = company?.logo ? getLogoSrc(company.logo) : null;

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* ==================================================
            PAGE HEADER
            ================================================== */}

        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs sm:tracking-[0.18em]">
                Company Profile
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
              Company
            </h1>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
              Manage your company information and profile.
            </p>
          </div>

          {company && !showForm && (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
            >
              <Pencil size={17} className="text-white" />
              Edit Company
            </button>
          )}
        </div>

        {/* ==================================================
            LOADING (only when the form is not open)
            ================================================== */}

        {loading && !showForm && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            <div className="animate-pulse">
              {/* COMPANY HERO SKELETON */}

              <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/5" />

                <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/5" />

                <div className="relative px-4 py-7 sm:px-8 sm:py-8">
                  <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                    {/* LOGO */}

                    <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                      <div className="h-20 w-20 shrink-0 rounded-full border-4 border-white bg-[#D5E1EB] shadow-lg sm:h-24 sm:w-24" />

                      {/* COMPANY INFO */}

                      <div className="min-w-0 max-w-full">
                        <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                          <div className="h-7 w-44 max-w-full rounded-md bg-[#D5E1EB] sm:h-8 sm:w-56" />

                          <div className="h-6 w-24 rounded-full bg-[#D5E1EB]" />
                        </div>

                        <div className="mt-3 h-9 w-52 max-w-full rounded-lg bg-white/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ABOUT SKELETON */}

              <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E2E8F0] sm:h-11 sm:w-11" />

                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-20 rounded bg-[#E2E8F0] sm:h-6" />

                    <div className="mt-2 h-3 w-48 max-w-full rounded bg-[#EEF2F6]" />
                  </div>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD]">
                  <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="h-3 w-full rounded bg-[#E2E8F0]" />

                    <div className="h-3 w-[94%] rounded bg-[#E2E8F0]" />

                    <div className="h-3 w-[78%] rounded bg-[#E2E8F0]" />

                    <div className="h-3 w-[58%] rounded bg-[#EEF2F6]" />
                  </div>
                </div>
              </div>

              {/* COMPANY DETAILS SKELETON */}

              <div className="min-w-0 bg-[#FBFCFD] p-4 sm:p-8">
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E2E8F0] sm:h-11 sm:w-11" />

                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-36 rounded bg-[#E2E8F0] sm:h-6" />

                    <div className="mt-2 h-3 w-60 max-w-full rounded bg-[#EEF2F6]" />
                  </div>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* WEBSITE */}

                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-16 rounded bg-[#D5E1EB]" />

                        <div className="mt-2.5 h-4 w-40 max-w-full rounded bg-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-16 rounded bg-[#D5E1EB]" />

                        <div className="mt-2.5 h-4 w-32 max-w-full rounded bg-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>

                  {/* INDUSTRY */}

                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-16 rounded bg-[#D5E1EB]" />

                        <div className="mt-2.5 h-4 w-28 max-w-full rounded bg-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>

                  {/* COMPANY SIZE */}

                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-24 rounded bg-[#D5E1EB]" />

                        <div className="mt-2.5 h-4 w-24 max-w-full rounded bg-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            GENERAL ERROR (hidden while the form is open,
            because the form shows its own errors)
            ================================================== */}

        {!loading && error && !companyNotFound && !showForm && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-700 sm:p-6 sm:text-sm">
            {typeof error === "string"
              ? error
              : error?.general || "Failed to load company."}
          </div>
        )}

        {/* ==================================================
            NO COMPANY
            ================================================== */}

        {!loading && companyNotFound && !showForm && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            <div className="relative overflow-hidden bg-[#E6EFF8] px-4 py-10 sm:px-8 sm:py-12">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/10" />

              <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/10" />

              <div className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm sm:h-16 sm:w-16">
                  <Building2
                    size={25}
                    className="text-[#526170] sm:h-7 sm:w-7"
                  />
                </div>

                <h2 className="mt-5 text-lg font-bold text-[#25364A] sm:text-xl">
                  Create your company profile
                </h2>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#6B7A89] sm:text-sm">
                  Add your company information so candidates can learn more
                  about your organization.
                </p>

                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md"
                >
                  <Plus size={18} className="text-white" />
                  Create Company
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            CREATE FORM (stays mounted while submitting)
            ================================================== */}

        {!company && showForm && (
          <CompanyForm onSuccess={handleFormSuccess} onCancel={handleCancel} />
        )}

        {/* ==================================================
            COMPANY PROFILE
            ================================================== */}

        {!loading && company && !showForm && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            {/* ==================================================
                COMPANY HERO
                ================================================== */}

            <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
              {/* Blue decorative shapes */}

              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/10" />

              <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/10" />

              <div className="relative px-4 py-7 sm:px-8 sm:py-8">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  {/* COMPANY LOGO */}

                  <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                      {companyLogo ? (
                        <button
                          type="button"
                          onClick={() => setShowLogoModal(true)}
                          className="group relative h-full w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-[#0859A8] focus:ring-offset-2"
                          aria-label="View company logo"
                        >
                          <img
                            src={companyLogo}
                            alt={`${company.companyName} logo`}
                            className="h-full w-full rounded-full object-cover transition duration-200 group-hover:brightness-90"
                          />

                          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#25364A]/0 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:bg-[#25364A]/35 group-hover:opacity-100">
                            View
                          </span>
                        </button>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Building2
                            size={28}
                            className="text-[#526170] sm:h-8 sm:w-8"
                          />
                        </div>
                      )}
                    </div>

                    {/* COMPANY INFO */}

                    <div className="min-w-0 max-w-full">
                      <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                        <h2 className="warp-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
                          {company.companyName}
                        </h2>

                        {company.industry && (
                          <span className="max-w-full rounded-full bg-[#0859A8] px-3 py-1 text-[11px] font-bold leading-4 text-white shadow-sm sm:text-xs">
                            {company.industry}
                          </span>
                        )}
                      </div>

                      {company.location && (
                        <div className="mt-3 inline-flex max-w-full items-start gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-[#526170]">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-[#526170]"
                          />
                          <span className="warp-break-words">
                            {company.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                ABOUT
                ================================================== */}

            <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                  <Building2
                    size={18}
                    className="text-[#526170] sm:h-4.75 sm:w-4.75"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                    About
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Company overview and introduction.
                  </p>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD]">
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  {company.description ? (
                    <p className="whitespace-pre-line wrap-break-words text-xs leading-6 text-[#526170] sm:text-sm sm:leading-7">
                      {company.description}
                    </p>
                  ) : (
                    <p className="text-xs italic text-[#8998A6] sm:text-sm">
                      No company description has been added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================
                COMPANY DETAILS
                ================================================== */}

            <div className="min-w-0 bg-[#FBFCFD] p-4 sm:p-8">
              <div className="mb-5 flex items-center gap-3 sm:mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                  <Factory
                    size={18}
                    className="text-[#526170] sm:h-4.75 sm:w-4.75"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Company Details
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Key information about your organization.
                  </p>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                {/* WEBSITE */}

                {company.website && (
                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                        <Globe2 size={17} className="text-[#526170]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                          Website
                        </p>

                        <a
                          href={getWebsiteUrl(company.website)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-flex max-w-full items-start gap-1 break-all text-xs font-semibold leading-5 text-[#25364A] transition hover:text-[#0859A8] hover:underline sm:text-sm"
                        >
                          <span className="break-all">{company.website}</span>

                          <ArrowUpRight
                            size={14}
                            className="mt-0.5 shrink-0 text-[#526170]"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOCATION */}

                {company.location && (
                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                        <MapPin size={17} className="text-[#526170]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                          Location
                        </p>

                        <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                          {company.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* INDUSTRY */}

                {company.industry && (
                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                        <Factory size={17} className="text-[#526170]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                          Industry
                        </p>

                        <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPANY SIZE */}

                {company.companySize && (
                  <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                        <Users size={17} className="text-[#526170]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                          Company Size
                        </p>

                        <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                          {company.companySize}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            EDIT FORM (stays mounted while submitting)
            ================================================== */}

        {company && showForm && (
          <CompanyForm
            company={company}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>

      {/* ==================================================
          COMPANY LOGO MODAL
          ================================================== */}

      {showLogoModal && companyLogo && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#25364A]/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setShowLogoModal(false)}
        >
          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setShowLogoModal(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:right-6 sm:top-6"
            aria-label="Close company logo"
          >
            <X size={22} className="text-white" />
          </button>

          {/* LARGE COMPANY LOGO */}

          <div
            className="relative flex h-[min(78vw,20rem)] w-[min(78vw,20rem)] max-w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl sm:h-96 sm:w-96"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={companyLogo}
              alt={`${company.companyName} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
