export const formatJobDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatSalary = (min, max) => {
  if (min == null || max == null) {
    return "Salary not specified";
  }

  return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;
};

export const formatJobType = (value) => {
  if (!value) return "";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatWorkMode = (value) => {
  if (!value) return "";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};
