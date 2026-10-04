const multer = require("multer");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // ==============================
  // MULTER ERRORS
  // ==============================

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File is too large",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ==============================
  // CUSTOM FILE TYPE ERROR
  // ==============================

  if (
    err.message === "Only PDF files are allowed" ||
    err.message === "Only JPEG, PNG, and WEBP images are allowed"
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ==============================
  // MONGOOSE INVALID ID
  // ==============================

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  // ==============================
  // NORMAL ERRORS
  // ==============================

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
};

module.exports = errorMiddleware;
