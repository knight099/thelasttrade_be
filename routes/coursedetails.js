const express = require("express");
const zod = require("zod");
const { User, CourseDetails } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { adminMiddleware, authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

const Courses = zod.object({
  email: zod.string().email().optional(),
  name: zod.string().optional(),
  courseName: zod.string().optional(),
  courseId: zod.string().optional(),
  startDate: zod.string().optional(),
  status: zod.string().optional(),
});

router.get('/user/courses', authMiddleware, async (req, res) => {
  try {
    // Find the user by the decoded user ID (from the JWT)
    const user = await User.findById(req.user.userId).populate('courses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the course details for the logged-in user
    res.status(200).json({ courses: user.courses });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
