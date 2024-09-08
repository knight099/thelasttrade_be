// docker restart e1db9182f28a06c3b224fe752458f401eb4d5f1749922457dfe640a97ae3d07a
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb+srv://admin:RitHSjBOuHqRFFnI@knight.33blvnl.mongodb.net/hrms"
);

const EmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    employeeCode: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
      maxLength: 6,
    },
    officeTimings: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      minLength: 5,
      required: false,
    },
  },
  { timestamps: true }
);

const AttendanceSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
    status: {
      type: String,
      enum: ["Absent", "Half-day", "Present", "Over-time"],
      default: "Absent",
    },
  },
  { timestamps: true }
);

// Leave Schema
const LeaveSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    email: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Disapproved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Methods for Employee Schema to handle password encryption

EmployeeSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
EmployeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// const SuperEmployeeSchema = new Schema({
//   // Add any additional fields required for superuser

// });

// Extend Employee Schema with additional methods for superuser features
EmployeeSchema.statics.addEmployee = async function (employeeData) {
  try {
    const employee = new this(employeeData);
    await employee.save();
    return employee;
  } catch (error) {
    throw error;
  }
};

EmployeeSchema.statics.editEmployee = async function (employeeId, updatedData) {
  try {
    const employee = await this.findByIdAndUpdate(employeeId, updatedData, {
      new: true,
    });
    return employee;
  } catch (error) {
    throw error;
  }
};

EmployeeSchema.statics.deleteEmployee = async function (employeeId) {
  try {
    const employee = await this.findByIdAndDelete(employeeId);
    return employee;
  } catch (error) {
    throw error;
  }
};

EmployeeSchema.statics.getAllEmployeesAttendance = async function () {
  try {
    const attendanceRecords = await Attendance.find().populate("employee");
    return attendanceRecords;
  } catch (error) {
    throw error;
  }
};

EmployeeSchema.statics.approveLeaveRequest = async function (leaveRequestId) {
  try {
    const leaveRequest = await Leave.findByIdAndUpdate(
      leaveRequestId,
      { status: "Approved" },
      { new: true }
    );
    return leaveRequest;
  } catch (error) {
    throw error;
  }
};

EmployeeSchema.statics.disapproveLeaveRequest = async function (
  leaveRequestId
) {
  try {
    const leaveRequest = await Leave.findByIdAndUpdate(
      leaveRequestId,
      { status: "Disapproved" },
      { new: true }
    );
    return leaveRequest;
  } catch (error) {
    throw error;
  }
};

// Export schemas
const Employee = mongoose.model("User", EmployeeSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);
const Leave = mongoose.model("Leave", LeaveSchema);
// const Superuser = mongoose.model("Superuser", SuperEmployeeSchema);

module.exports = { Employee, Attendance, Leave };
