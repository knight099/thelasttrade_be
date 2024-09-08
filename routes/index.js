const express = require("express");
const userRouter = require("./user.js");
const adminRouter = require("./admin.js");
const attendanceRouter = require("./attendance.js");
const leaveRouter = require("./leave.js");

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/attendance", attendanceRouter);
router.use("/leave", leaveRouter);

module.exports = router;
