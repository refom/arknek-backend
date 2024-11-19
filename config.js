import { fileURLToPath, URL } from "node:url";

const CONFIG = {
	PORT: 3000,
	ROOT_PATH: fileURLToPath(new URL("./", import.meta.url)),
	PUBLIC_PATH: "db",
	LOCAL_PATH: "D:\\Repoms\\Project\\arknights-db",
	DB: {
		OPERATOR: "operator.json",
		ACC: {
			PUBLIC: "acc.json",
			DETAIL: "acc_detail.json",
			GACHA: "acc_gacha.json",
			PRIVATE: "acc_private.json",
			DUMMY: "acc_dummy.json",
			SOLD: "acc_sold.json",
		},
		COUNTER: "counter.json",
		COUNTER_LINK: "counter_link.json",
		PART: "part.json",
		TAG: "tag.json",
	},
}

export default CONFIG