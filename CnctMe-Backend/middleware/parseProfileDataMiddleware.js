const parseProfileData = (req, res, next) => {
  try {
    if (req.body.skills) {
      req.body.skills = JSON.parse(req.body.skills);
    }

    if (req.body.education) {
      req.body.education = JSON.parse(req.body.education);
    }

    if (req.body.experience) {
      req.body.experience = JSON.parse(req.body.experience);
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Skills, education, or experience must contain valid JSON",
    });
  }
};

module.exports = parseProfileData;
