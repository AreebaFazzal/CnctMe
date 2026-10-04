const Notification = require("../models/notificationModel");

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  relatedJob = null,
  relatedApplication = null,
  relatedInterview = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedJob,
      relatedApplication,
      relatedInterview,
    });

    return notification;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
};
