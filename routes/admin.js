const express = require("express");
const zod = require("zod");
const { Employee, Attendance, Leave } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { adminMiddleware, authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Add, Edit, Delete Employees - Admin Routes
const adminEmployeeBody = zod.object({
  email: zod.string().email().optional(),
  name: zod.string().optional(),
  password: zod.string().optional(),
  department: zod.string().optional(),
  designation: zod.string().optional(),
  employeeCode: zod.string().optional(),
  officeTimings: zod.string().optional(),
  role: zod.string().optional(),
});
// adminMiddleware,

router.post("/employee", authMiddleware, adminMiddleware, async (req, res) => {
  const result = adminEmployeeBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const employee = await Employee.create(req.body);

  res.json({
    message: "Employee added successfully",
    employee: employee,
  });
});

router.put(
  "/employee/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const result = adminEmployeeBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Employee updated successfully",
      employee: employee,
    });
  }
);

router.delete(
  "/employee/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      message: "Employee deleted successfully",
    });
  }
);

// View Attendance Records - Admin Route
router.get("/attendance", authMiddleware, adminMiddleware, async (req, res) => {
  const attendanceRecords = await Attendance.find().populate("employee");

  res.json({
    attendance: attendanceRecords,
  });
});

// Approve/Disapprove Leave Requests - Admin Routes
router.put(
  "/leave/requests/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const leaveRequest = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.json({
      message: "Leave request approved",
      leaveRequest: leaveRequest,
    });
  }
);

router.put(
  "/leave/requests/:id/disapprove",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const leaveRequest = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Disapproved" },
      { new: true }
    );

    res.json({
      message: "Leave request disapproved",
      leaveRequest: leaveRequest,
    });
  }
);

module.exports = router;
