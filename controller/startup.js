
import OPERATOR from "./operator.js";
import PART from "./part.js";
import TAG from "./tag.js";
import ACC from "./acc.js";

const Startup = () => {
	console.log("Startup Fetch");

	OPERATOR.Fetch();
	process.stdout.write("[✔️ Operator]");

	PART.Fetch();
	process.stdout.write("[✔️ Part]");

	TAG.Fetch();
	process.stdout.write("[✔️ Tag]");

	ACC.Fetch();
	process.stdout.write("[✔️ Acc]");
	console.log("");
}


export default Startup