import { fileURLToPath, URL } from "node:url";

const CONFIG = {
	PORT: 3000,
	ROOT_PATH: fileURLToPath(new URL("./", import.meta.url)),
	PUBLIC_PATH: "db",
	PRIVATE_PATH: "D:\\Repoms\\Project\\arknights-db",
	ID_CODE: {
		PUBLIC: "ARK",
		DUMMY: "DUM",
		GACHA: "GAC",
	},
	DB: {
		OPERATOR: "operator.json",
		ACC: {
			PUBLIC: "acc.json",
			DETAIL: "acc_detail.json",
			PRIVATE: "acc_private.json",
			DUMMY: "acc_dummy.json",
			SOLD: "acc_sold.json",
			LINK: "acc_link.json",
		},
		COUNTER: "counter.json",
		PART: "part.json",
		TAG: "tag.json",
		GROUP: "group.json",
	},
	COUNTER_TYPE: {
		PUBLIC: "public",
		DUMMY: "dummy",
		GACHA: "gacha",
	}
}

export default CONFIG