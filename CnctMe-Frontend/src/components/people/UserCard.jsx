import { Link } from "react-router-dom";
import { MapPin, UserRound, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const UserCard = ({ user }) => {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim() || "User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const role = user?.role === "recruiter" ? "Recruiter" : "Jobseeker";

  const profilePictureUrl = user?._id
    ? `${API_BASE_URL}/users/public/${user._id}/profile-picture`
    : null;

  const location =
    typeof user?.location === "string"
      ? user.location
      : [user?.location?.city, user?.location?.country]
          .filter(Boolean)
          .join(", ");

  const skills = Array.isArray(user?.skills) ? user.skills : [];

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3E8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#BFD5E5] hover:shadow-[0_8px_28px_rgba(8,89,168,0.10)]">
      {/* TOP AREA */}

      <div className="relative border-b border-[#E3E9EE] bg-[#E6EFF8] px-5 pb-5 pt-6">
        <div className="absolute right-4 top-4">
          <span className="rounded-full border border-[#BFD5E5] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0859A8]">
            {role}
          </span>
        </div>

        {/* PROFILE IMAGE */}

        <div className="flex justify-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt={fullName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}

            <div
              className={`${
                profilePictureUrl ? "hidden" : "flex"
              } h-full w-full items-center justify-center bg-[#EEF6FB] text-2xl font-bold text-[#0859A8]`}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* NAME */}

        <div className="mt-4 text-center">
          <h3 className="wrap-break-words text-lg font-bold text-[#25364A]">
            {fullName}
          </h3>

          <p className="mt-1 wrap-break-words text-sm text-[#68798A]">
            {user?.position || "Professional"}
          </p>
        </div>
      </div>

      {/* BODY */}

      <div className="flex flex-1 flex-col p-5">
        {/* LOCATION */}

        {location && (
          <div className="flex items-center gap-2 text-xs text-[#68798A]">
            <MapPin size={15} className="shrink-0 text-[#0859A8]" />

            <span className="truncate">{location}</span>
          </div>
        )}

        {/* BIO */}

        {user?.bio && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#64748B]">
            {user.bio}
          </p>
        )}

        {/* SKILLS */}

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill, index) => {
              const skillName =
                typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.title || "";

              if (!skillName) return null;

              return (
                <span
                  key={`${skillName}-${index}`}
                  className="rounded-md border border-[#D5E4EF] bg-[#F5F9FC] px-2 py-1 text-[10px] font-semibold text-[#526170]"
                >
                  {skillName}
                </span>
              );
            })}

            {skills.length > 4 && (
              <span className="rounded-md bg-[#E6EFF8] px-2 py-1 text-[10px] font-semibold text-[#0859A8]">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* BUTTON */}

        <Link
          to={`/profile/${user._id}`}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
        >
          <UserRound size={16} />
          View Profile
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
