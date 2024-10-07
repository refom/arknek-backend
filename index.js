const express = require("express");
const cors = require("cors");
const CONFIG = require("./config.js");
const STATUS = require("./routes/status");

const Startup = require("./features/startup.js");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// logging
app.use("/", (req, res, next) => {
	console.log("Request: " + req.method + " " + req.url);
	console.log("body: ", req.body);
	console.log("params:", req.params);
	next();
});

// routes
const operator = require("./routes/operator");
app.use("/operator", operator);

const acc = require("./routes/acc");
app.use("/acc", acc);

const part = require("./routes/part");
app.use("/part", part);

// not found
app.get("*", (req, res) => {
	res.send(STATUS.Bad("Page not found"));
});

// when server start
app.listen(CONFIG.PORT, () => {
	console.log(`Listening on port ${CONFIG.PORT}!`);
	Startup();
});
