const express = require("express");
const zod = require("zod");
const { User, CourseDetails } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { adminMiddleware, authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Add, Edit, Delete Users - Admin Routes
const adminUserBody = zod.object({
  email: zod.string().email().optional(),
  name: zod.string().optional(),
  password: zod.string().optional(),
});
// adminMiddleware,

router.post("/user", authMiddleware, adminMiddleware, async (req, res) => {
  const result = adminUserBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const user = await User.create(req.body);

  res.json({
    message: "User added successfully",
    user: user,
  });
});

router.put("/user/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const result = adminUserBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "User updated successfully",
      user: user,
    });
  }
);

router.delete(
  "/user/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  }
);




module.exports = router;
