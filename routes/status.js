
const Ok = (data, message) => {
	return {
		status: "ok",
		data: data,
		message: message || "Request success"
	}
}

const Bad = (message) => {
	return {
		status: "bad",
		message: message || "Request failed"
	}
}

module.exports = {
	Ok,
	Bad
}