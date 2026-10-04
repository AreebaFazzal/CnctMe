export const getStatusClasses = (status) => {
  switch (status) {
    case "Applied":
      return "bg-[#E6EFF8] text-[#0859A8]";

    case "Under Review":
      return "bg-[#FFF7E6] text-[#9A6700]";

    case "Shortlisted":
      return "bg-[#EEF8F1] text-[#2E8B57]";

    case "Interview":
      return "bg-[#F3EEFF] text-[#7655B5]";

    case "Selected":
      return "bg-[#E8F7F0] text-[#16805C]";

    case "Rejected":
      return "bg-[#FBECEE] text-[#C0394B]";

    default:
      return "bg-[#F1F5F9] text-[#64748B]";
  }
};

export const getApplicationStatusClasses = (status) => {
  switch (status) {
    case "Applied":
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";

    case "Under Review":
      return "border-[#BFD5E5] bg-[#E6EFF8] text-[#0859A8]";

    case "Shortlisted":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "Interview":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "Selected":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";
  }
};

export const getInterviewStatusClasses = (status) => {
  switch (status) {
    case "Scheduled":
      return "border-[#BFD5E5] bg-[#E6EFF8] text-[#0859A8]";

    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";
  }
};
