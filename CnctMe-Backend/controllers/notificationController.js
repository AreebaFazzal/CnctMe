const Notification = require("../models/notificationModel");

const createError = require("../utils/createError");

// ==========================================
// GET ALL MY NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res) => {
  const userId = req.user.userId;

  const notifications = await Notification.find({
    recipient: userId,
  })
    .populate("relatedJob", "title location")
    .populate("relatedApplication", "status createdAt")
    .populate("relatedInterview")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    notifications,
  });
};

// ==========================================
// GET UNREAD NOTIFICATIONS
// ==========================================

const getUnreadNotifications = async (req, res) => {
  const userId = req.user.userId;

  const notifications = await Notification.find({
    recipient: userId,
    isRead: false,
  })
    .populate("relatedJob", "title location")
    .populate("relatedApplication", "status createdAt")
    .populate("relatedInterview")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    notifications,
  });
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead = async (req, res) => {
  const userId = req.user.userId;

  const notificationId = req.params.notificationId;

  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  notification.isRead = true;

  await notification.save();

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
};

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.userId;

  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },

    {
      $set: {
        isRead: true,
      },
    },
  );

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = async (req, res) => {
  const userId = req.user.userId;

  const notificationId = req.params.notificationId;

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
};

// ==========================================
// DELETE ALL NOTIFICATIONS
// ==========================================

const deleteAllNotifications = async (req, res) => {
  const userId = req.user.userId;

  await Notification.deleteMany({
    recipient: userId,
  });

  return res.status(200).json({
    success: true,
    message: "All notifications deleted successfully",
  });
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
