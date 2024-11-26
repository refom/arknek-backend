import express from "express";
import cors from "cors";
import CONFIG from "#src/config.js";
import Startup from "#controller/startup.js";

const app = express();

// middleware
app.use(express.json());
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
import dummy from "#routes/dummy.js";
import counter from "#routes/counter.js";
import sold from "#routes/sold.js";

app.use("/operator", operator);
app.use("/part", part);
app.use("/tag", tag);
app.use("/acc", acc);
app.use("/dummy", dummy);
app.use("/counter", counter);
app.use("/sold", sold);

// not found
app.get("*", (req, res) => {
	res.status(404).send("Page not found");
});

import { ShowApi } from "#src/utils/helper.js";

// when server start
app.listen(CONFIG.PORT, () => {
	console.log(`Listening on port ${CONFIG.PORT}!`);
	Startup();
	ShowApi(app)
});
