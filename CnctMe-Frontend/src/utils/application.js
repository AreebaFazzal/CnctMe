export const getApplicationId = (interview) => {
  const application = interview?.application;

  if (!application) {
    return null;
  }

  if (typeof application === "object") {
    return application?._id || application?.id || null;
  }

  return application;
};

export const getApplicationStatus = (interview) => {
  return interview?.application?.status || "Interview";
};
