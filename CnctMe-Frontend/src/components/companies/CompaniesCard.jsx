import { Link } from "react-router-dom";
import { useState } from "react";

import { MapPin, Users, ArrowRight, Globe, Building2 } from "lucide-react";

import Card from "../ui/Card";
import getLogoSrc from "../../utils/logo";

const CompanyCard = ({ company }) => {
  const logoSrc = getLogoSrc(company.logo);
  const [imgError, setImgError] = useState(false);

  const showFallback = !logoSrc || imgError;

  const websiteHref = company.website
    ? /^https?:\/\//i.test(company.website)
      ? company.website
      : `https://${company.website}`
    : null;

  const websiteText = company.website
    ? company.website.replace(/^https?:\/\//i, "").replace(/\/$/, "")
    : "";

  return (
    <Card
      padding="none"
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0A66C2]/30 hover:shadow-lg hover:shadow-[#0A66C2]/10"
    >
      {/* Top Accent */}

      <div className="h-1.5 w-full shrink-0 bg-linear-to-r from-[#0A66C2] via-[#38BDF8] to-[#0A66C2]" />

      {/* Decorative Glow */}

      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#0A66C2]/5 blur-3xl transition-all duration-500 group-hover:bg-[#0A66C2]/10 sm:h-40 sm:w-40" />

      <div className="relative flex h-full min-w-0 flex-col p-4 sm:p-5">
        {/* Company Header */}

        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          {/* Logo */}

          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#0A66C2]/15 bg-[#E6EFF8] p-1.5 shadow-sm transition-all duration-300 group-hover:border-[#0A66C2]/30 group-hover:shadow-md sm:h-18 sm:w-18">
              <div className="h-full w-full overflow-hidden rounded-full bg-white">
                {!showFallback ? (
                  <img
                    src={logoSrc}
                    alt={`${company.companyName} logo`}
                    onError={() => setImgError(true)}
                    className="h-full w-full rounded-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-[#0A66C2] to-[#07539D] text-xl font-bold text-white sm:text-2xl">
                    {company.companyName?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}
              </div>
            </div>

            {/* Company Icon Badge */}

            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#0A66C2] text-white shadow-sm sm:h-6 sm:w-6">
              <Building2 size={11} strokeWidth={2.4} />
            </div>
          </div>

          {/* Company Name */}

          <div className="min-w-0 flex-1 pt-1">
            <h2 className="line-clamp-2 wrap-break-words text-base font-bold leading-5.5 text-slate-900 transition-colors duration-200 sm:text-lg sm:leading-6">
              {company.companyName}
            </h2>

            {company.industry && (
              <div className="mt-1.5 inline-flex max-w-full items-center rounded-full border border-[#0A66C2]/10 bg-[#E6EFF8] px-2.5 py-1">
                <span className="truncate text-[11px] font-semibold text-[#0A66C2]">
                  {company.industry}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="mt-5">
          <p className="line-clamp-3 min-h-16.5 text-sm leading-5.5 text-slate-500">
            {company.description ||
              "Discover this company and explore exciting career opportunities."}
          </p>
        </div>

        {/* Company Info */}

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Location */}

            {company.location && (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A66C2] shadow-sm ring-1 ring-slate-100">
                  <MapPin size={15} strokeWidth={2.25} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                    {company.location}
                  </p>
                </div>
              </div>
            )}

            {/* Company Size */}

            {company.companySize && (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A66C2] shadow-sm ring-1 ring-slate-100">
                  <Users size={15} strokeWidth={2.25} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Size
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                    {company.companySize}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Website */}

        {websiteHref && (
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-[#0A66C2]"
          >
            <Globe
              size={14}
              className="shrink-0 text-[#0A66C2]"
              strokeWidth={2}
            />

            <span className="truncate">{websiteText}</span>
          </a>
        )}

        {/* Divider */}

        <div className="mt-4 border-t border-slate-100" />

        {/* Button */}

        <div className="mt-4">
          <Link
            to={`/companies/${company._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#0958A8] hover:shadow-md hover:shadow-[#0A66C2]/20 active:scale-[0.98]"
          >
            <span>View Company</span>

            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CompanyCard;
