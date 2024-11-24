// docker restart e1db9182f28a06c3b224fe752458f401eb4d5f1749922457dfe640a97ae3d07a
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb+srv://admin:RitHSjBOuHqRFFnI@knight.33blvnl.mongodb.net/thelasttrade"
);

const UserSchema = new Schema(
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
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    }
  },
  { timestamps: true }
);


// CourseDetails Schema
const CourseDetailsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User schema
    email: { type: String, required: true }, // Email of the user, could also be fetched from the User reference if needed
    courseName: { type: String, required: true }, // Name of the course the user is registered in
    courseId: { type: String, required: true, unique: true }, // Unique identifier for the course
    duration: { type: String, required: true }, // Duration of the course (e.g., "4 weeks", "3 months")
    startDate: { type: Date, required: true }, // Course start date
    endDate: { type: Date }, // Optional end date for the course
    price: { type: Number, required: true }, // Course price
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    }, // Status of the course for the user
  },
  { timestamps: true }
);





// Methods for Employee Schema to handle password encryption

UserSchema.pre("save", async function (next) {
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
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


UserSchema.statics.editUser = async function (email, updatedData) {
  try {
    const user = await this.findByIdAndUpdate(email, updatedData, {
      new: true,
    });
    return employee;
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.deleteUser = async function (email) {
  try {
    const user = await this.findByIdAndDelete(email);
    return user;
  } catch (error) {
    throw error;
  }
};





// Export schemas
const User = mongoose.model("User", UserSchema);

const CourseDetails = mongoose.model("CourseDetails", CourseDetailsSchema);
// const Superuser = mongoose.model("Superuser", SuperUserSchema);

module.exports = { User, CourseDetails };
