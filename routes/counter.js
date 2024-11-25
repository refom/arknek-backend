import { Router } from "express";
const router = Router();

import Status from "#src/utils/status.js";
import CONTROLLER from "#controller/acc_link.js";

const SendResult = (res, result) => {
	if (!result.status) return Status.Bad(res, result.message);
	return Status.Ok(res, CONTROLLER.Fetch(), result.message);
}

// GET /
// Get unused counter
router.get("/unused/:id_part", (req, res) => {
	const id_part = req.params.id_part;
	return Status.Ok(res, CONTROLLER.GetUnusedCounter(id_part));
});

// GET /login/:id
// Login
router.get("/login/:id", (req, res) => {
	const id = req.params.id;
	const result = CONTROLLER.Login(id)
	return SendResult(res, result);
})

// GET /backup
// Backup Tag
// router.get("/backup", (req, res) => {
// 	const result = CONTROLLER.Backup();
// 	return SendResult(res, result);
// })


export default router;
