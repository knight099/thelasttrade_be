const express = require("express");
const zod = require("zod");
const { User, CourseDetails } = require("../db");
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../config");
const { authMiddleware, adminMiddleware } = require("../middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// User Signup/Registration Schema
const signupBody = zod.object({
  email: zod.string().email(),
  name: zod.string(),
  password: zod.string()
});

router.post("/signup", async (req, res) => {
  const result = signupBody.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const existingUser = await User.findOne({
    email: req.body.email,
    phone: req.body.phone,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Email/Phone already registered",
    });
  }

  const newUser = await User.create(req.body); // Renamed 'User' to 'newUser'

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});


// User Signin
const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const result = signinBody.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const existingUser = await User.findOne({
    email: req.body.email,
  });
  console.log("user", existingUser)

  if (existingUser && (await existingUser.comparePassword(req.body.password))) {
    const token = jwt.sign(
      {
        email: User.email,
      },
      JWT_SECRET
    );

    const loginTime = new Date();
    const today = loginTime.toISOString().split("T")[0];

    res.json({
      token: token,
      role: User.role,
    });
    return;
  }

  res.status(400).json({
    message: "Invalid email or password",
  });
});

router.post("/signout", authMiddleware, async (req, res) => {
  try {
    // Clear any cookies or tokens (if using cookies for token storage)
    res.clearCookie("token"); // This assumes you store the JWT in a cookie

    // Optionally, handle token invalidation (e.g., by maintaining a token blacklist)
    // You can store invalidated tokens in a database or in-memory store like Redis

    // Send a success response
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Logout failed", error: error.message });
  }
});

// Update User Information
const updateBody = zod.object({
  password: zod.string().optional(),
  name: zod.string().optional(),
});

router.put("/update", authMiddleware, adminMiddleware, async (req, res) => {
  const result = updateBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  await User.updateOne({ _id: req.email }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

// Get User Details
router.get("/bulk", adminMiddleware, adminMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const Users = await User.find({
    $or: [{ name: { $regex: filter } }, { email: { $regex: filter } }],
  });

  res.json({
    Users: Users.map((User) => ({
      email: User.email,
      name: User.name,
      _id: User._id,
    })),
  });
});

module.exports = router;
