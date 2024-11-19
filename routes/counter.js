// import { Router } from "express";
// const router = Router();

// import Status from "#src/utils/status.js";
// import CONTROLLER from "#controller/tag.js";

// const SendResult = (res, result) => {
// 	if (!result.status) return Status.Bad(res, result.message);
// 	return Status.Ok(res, CONTROLLER.Fetch(), result.message);
// }

// GET /
// Get all Tag
// router.get("/", (req, res) => {
// 	return Status.Ok(res, CONTROLLER.Fetch());
// });

// GET /backup
// Backup Tag
// router.get("/backup", (req, res) => {
// 	const result = CONTROLLER.Backup();
// 	return SendResult(res, result);
// })


// export default router;
