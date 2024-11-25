
import OPERATOR from "./operator.js";
import PART from "./part.js";
import TAG from "./tag.js";
import ACC from "./acc.js";
import LINK from "./acc_link.js";
import COUNTER from "./counter.js";
import DUMMY from "./dummy.js";

const Startup = () => {
	// Custom Object filter
	Object.filter = (obj, predicate) => 
		Object.keys(obj)
			.filter( key => predicate(obj[key]) )
			.reduce( (res, key) => Object.assign(res, { [key]: obj[key] }), {} );

	console.log("Startup Fetch");

	OPERATOR.Fetch();
	process.stdout.write("[✔️ Operator]");

	PART.Fetch();
	process.stdout.write("[✔️ Part]");

	TAG.Fetch();
	process.stdout.write("[✔️ Tag]");

	COUNTER.Fetch();
	process.stdout.write("[✔️ Counter]");

	LINK.Fetch();
	process.stdout.write("[✔️ Acc Link]");

	DUMMY.Fetch();
	process.stdout.write("[✔️ Dummy]");
	
	ACC.Fetch();
	ACC.Fetch(true);
	process.stdout.write("[✔️ Acc]");
	console.log("");
}


export default Startup