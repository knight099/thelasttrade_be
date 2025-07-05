const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index.js");
const app = express();

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specified methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(express.json());

// const router = require("./routes/index.js");

app.use("/api/v1", rootRouter);
console.log("initiating");

app.listen(3000);
