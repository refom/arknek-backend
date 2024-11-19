import express, { json } from "express";
import cors from "cors";
import CONFIG from "#src/config.js";

// import Startup from "./features/startup.js";

const app = express();

// middleware
app.use(json());
app.use(cors());

// logging
app.use("/", (req, res, next) => {
	console.log("Request: " + req.method + " " + req.url);
	next();
});

// routes
import operator from "#routes/operator.js";
app.use("/operator", operator);

// const acc = require("./routes/acc");
// app.use("/acc", acc);

// const part = require("./routes/part");
// app.use("/part", part);

// const tag = require("./routes/tag");
// app.use("/tag", tag);

// const dummy = require("./routes/dummy");
// app.use("/dummy", dummy);

// not found
app.get("*", (req, res) => {
	res.status(404).send("Page not found");
});

// when server start
app.listen(CONFIG.PORT, () => {
	console.log(`Listening on port ${CONFIG.PORT}!`);
	// Startup();
});
