const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");
const { Employee } = require("./db");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findOne({ email: decoded.email });

    if (!employee) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.employee = employee;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized admin" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
