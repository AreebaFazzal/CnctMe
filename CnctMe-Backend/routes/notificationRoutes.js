const express = require("express");

const router = express.Router();

const {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

const asyncHandler = require("../utils/asyncHandler");

const userMiddleware = require("../middleware/userMiddleware");

router.get("/", userMiddleware, asyncHandler(getNotifications));

router.get("/unread", userMiddleware, asyncHandler(getUnreadNotifications));

router.patch(
  "/:notificationId/read",
  userMiddleware,
  asyncHandler(markNotificationAsRead),
);

router.patch(
  "/read-all",
  userMiddleware,
  asyncHandler(markAllNotificationsAsRead),
);

router.delete(
  "/:notificationId",
  userMiddleware,
  asyncHandler(deleteNotification),
);

router.delete("/", userMiddleware, asyncHandler(deleteAllNotifications));

module.exports = router;
