const express = require("express");
const cors = require("cors");
const CONFIG = require("./config.js");
const { getOperators } = require("./features/operators.js");
const { writeFile } = require("fs");

const app = express();
// middleware
app.use(express.json());
app.use(cors());

let OPERATORS = [];

const CheckOperators = () => {
	if (OPERATORS.length <= 0) {
		OPERATORS = getOperators(CONFIG);
	}
};

const CheckBody = (data) => {
	if (!data) {
		console.log("Data tidak lengkap");
		return false
	}
	return true
}

// when server start
app.listen(CONFIG.PORT, () => {
	console.log(`Listening on port ${CONFIG.PORT}!`);
	CheckOperators();
	// console.log("operators: " + OPERATORS);
});


// get operators
app.get("/operators", (req, res) => {
	OPERATORS = getOperators(CONFIG)
	res.status(200).send({ status: true, data: OPERATORS});
});

// add new operator
app.post("/operator", (req, res) => {
	const operator = req.body;
	if (!CheckBody(operator)) return res.status(200).json({ status: false, message: "Data tidak lengkap" });
	CheckOperators();

	if (OPERATORS.find((op) => op.id === operator.id)) {
		return res.status(200).json({ status: false, message: "Operator already exists" });
	}
	OPERATORS.push(operator);

	writeFile(CONFIG.OPERATORS_PATH, JSON.stringify(OPERATORS), (err) => {
		if (err) {
			console.log(err);
			return res.status(200).json({ status: false, message: "Internal server error" });
		}
	});
	console.log("Data berhasil ditambahkan");
	res.status(200).json({status: true, message: "Data berhasil ditambahkan", data: OPERATORS});
})

// delete operator
app.post("/delete-operator", (req, res) => {
	const operator = req.body;
	if (!CheckBody(operator)) return res.status(200).json({ status: false, message: "Data tidak lengkap" });
	CheckOperators();
	OPERATORS = OPERATORS.filter((op) => op.id !== operator.id);
	console.log(operator)

	writeFile(CONFIG.OPERATORS_PATH, JSON.stringify(OPERATORS), (err) => {
		if (err) {
			console.log(err);
			return res.status(200).json({ status: false, message: "Internal server error" });
		}
	});
	console.log("Data berhasil dihapus");
	res.status(200).json({status: true, message: "Data berhasil dihapus", data: OPERATORS});
})

// edit operator
app.post("/edit-operator", (req, res) => {
	const operator = req.body;
	if (!CheckBody(operator)) return res.status(200).json({ status: false, message: "Data tidak lengkap" });
	CheckOperators();
	const editOp = OPERATORS.find((op) => op.id === operator.idBefore);

	if (!editOp) {
		return res.status(200).json({ status: false, message: "Operator not found" });
	}
	
	editOp.id = operator.id;
	editOp.name = operator.name;
	editOp.rarity = operator.rarity;

	writeFile(CONFIG.OPERATORS_PATH, JSON.stringify(OPERATORS), (err) => {
		if (err) {
			console.log(err);
			return res.status(200).json({ status: false, message: "Internal server error" });
		}
	});
	console.log("Data berhasil diedit");
	res.status(200).json({status: true, message: "Data berhasil diedit", data: OPERATORS});

})

