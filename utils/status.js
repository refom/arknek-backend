
class Status {
	static Ok = (res, data, message) => {
		const payload = {
			data,
			message: message || "Request success"
		}
		res.status(200).send(payload)
	}

	static Bad = (res, message) => {
		res.status(400).send(message)
	}

	static Finish = (message) => {
		return { status: true, message };
	}

	static Fail = (message) => {
		return { status: false, message };
	}
}

export default Status
