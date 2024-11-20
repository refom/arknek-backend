import express, { json } from "express";
import cors from "cors";
import CONFIG from "#src/config.js";
import Startup from "#controller/startup.js";

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
import part from "#routes/part.js";
import tag from "#routes/tag.js";
import acc from "#routes/acc.js";

app.use("/operator", operator);
app.use("/part", part);
app.use("/tag", tag);
app.use("/acc", acc);

// const dummy = require("./routes/dummy");
// app.use("/dummy", dummy);

// not found
app.get("*", (req, res) => {
	res.status(404).send("Page not found");
});

// when server start
app.listen(CONFIG.PORT, () => {
	console.log(`Listening on port ${CONFIG.PORT}!`);
	Startup();
});
