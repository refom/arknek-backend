
import OPERATOR from "./operator.js";
import PART from "./part.js";

const Startup = () => {
	console.log("Startup Fetch");

	OPERATOR.Fetch();
	process.stdout.write("[✔️ Operator]");

	PART.Fetch();
	process.stdout.write("[✔️ Part]");
}


export default Startup