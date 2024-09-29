const express = require("express");
const userRouter = require("./user.js");
const adminRouter = require("./admin.js");
const attendanceRouter = require("./coursedetials.js");


const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/coursedetails", attendanceRouter);

module.exports = router;
