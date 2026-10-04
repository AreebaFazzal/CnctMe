const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
} = require("../controllers/adminUserController");

const userMiddleware = require("../middleware/userMiddleware");
const verifiedMiddleware = require("../middleware/verifiedMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getAllUsers),
);

router.get(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(getUserById),
);

router.put(
  "/:id/block",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(blockUser),
);

router.put(
  "/:id/unblock",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(unblockUser),
);

router.delete(
  "/:id",
  userMiddleware,
  verifiedMiddleware,
  roleMiddleware(["admin"]),
  asyncHandler(deleteUser),
);

module.exports = router;
