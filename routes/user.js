const express = require("express");
const zod = require("zod");
const { Employee, Attendance, Leave } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware, adminMiddleware } = require("../middleware");

const router = express.Router();

// Employee Signup/Registration Schema
// const signupBody = zod.object({
//   email: zod.string().email(),
//   name: zod.string(),
//   password: zod.string(),
//   department: zod.string(),
//   designation: zod.string(),
//   employeeCode: zod.string(),

//   officeTimings: zod.string(),
// });

// router.post("/signup", async (req, res) => {
//   const result = signupBody.safeParse(req.body);

//   if (!result.success) {
//     return res.status(400).json({
//       message: "Invalid input",
//     });
//   }

//   const existingUser = await Employee.findOne({
//     email: req.body.email,
//   });

//   if (existingUser) {
//     return res.status(400).json({
//       message: "Email already registered",
//     });
//   }

//   const employee = await Employee.create(req.body);

//   const token = jwt.sign(
//     {
//       userId: employee._id,
//       role: employee.role,
//     },
//     JWT_SECRET
//   );

//   res.json({
//     message: "User created successfully",
//     token: token,
//   });
// });

// Employee Signin
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

  const employee = await Employee.findOne({
    email: req.body.email,
  });

  if (employee && (await employee.comparePassword(req.body.password))) {
    const token = jwt.sign(
      {
        email: employee.email,
        role: employee.role,
      },
      JWT_SECRET
    );

    const loginTime = new Date();
    const today = loginTime.toISOString().split("T")[0];

    const addAttendance = await Attendance.create({
      email: employee.email,
      employee: employee._id,
      date: today,
      loginTime: loginTime,
    });

    res.json({
      token: token,
      role: employee.role,
      logintime: addAttendance.loginTime,
    });
    return;
  }

  res.status(400).json({
    message: "Invalid email or password",
  });
});

router.post("/signout", authMiddleware, async (req, res) => {
  const logoutDate = new Date();
  const today = new Date().toISOString().split("T")[0]; // Current date

  const attendance = await Attendance.findOne({
    email: req.email, // Find by email and date
    date: today,
  });

  if (!attendance) {
    return res
      .status(400)
      .json({ message: "No attendance record found for today" });
  }

  const loginDate = new Date(attendance.loginTime);
  const hoursWorked = (logoutDate - loginDate) / (1000 * 60 * 60);

  let status = "Absent";
  if (hoursWorked >= 5 && hoursWorked < 9) {
    status = "Half-day";
  } else if (hoursWorked >= 9 && hoursWorked < 10) {
    status = "Present";
  } else if (hoursWorked >= 10) {
    status = "Over-time";
  }

  attendance.logoutTime = logoutDate;
  attendance.status = status;

  await attendance.save();

  res.json({ message: "Logout successful", attendance });
});

// Update Employee Information
const updateBody = zod.object({
  password: zod.string().optional(),
  name: zod.string().optional(),
  department: zod.string().optional(),
  designation: zod.string().optional(),
  officeTimings: zod.string().optional(),
});

router.put("/update", authMiddleware, adminMiddleware, async (req, res) => {
  const result = updateBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  await Employee.updateOne({ _id: req.email }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

// Get User Details
router.get("/bulk", adminMiddleware, adminMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const employees = await Employee.find({
    $or: [{ name: { $regex: filter } }, { email: { $regex: filter } }],
  });

  res.json({
    employees: employees.map((employee) => ({
      email: employee.email,
      name: employee.name,
      department: employee.department,
      designation: employee.designation,
      employeeCode: employee.employeeCode,
      officeTimings: employee.officeTimings,
      _id: employee._id,
    })),
  });
});

module.exports = router;
