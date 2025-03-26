const typescriptTransform = require("i18next-scanner-typescript");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	input: [path.join(__dirname, "web/sources/**/*.*").replace(/\\/g, "/")],
	options: {
		removeUnusedKeys: true,
		sort: true,
		func: {
			list: ["tran.t", "t"],
			extensions: [".js", ".jsx"],
		},
		trans: {
			component: "Trans",
			i18nKey: "i18nKey",
			defaultsKey: "defaults",
			extensions: [".js", ".jsx"],
			fallbackKey: function (ns, value) {
				return value;
			},
			keepBasicHtmlNodesFor: ["br", "strong", "i", "u", "p", "a"],
			acorn: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
		defaultValue: function (lng, ns, key) {
			return "__NOT_TRANSLATED__";
		},
		lngs: ["en"],
		defaultLng: "en",
		nsSeparator: false,
		keySeparator: false,
		resource: {
			loadPath: path
				.join(__dirname, "web/sources/translations/assets/{{lng}}.json")
				.replace(/\\/g, "/"),
			savePath: path
				.join(__dirname, "web/sources/translations/assets/{{lng}}.json")
				.replace(/\\/g, "/"),
			jsonIndent: 4,
			lineEnding: "\n",
		},
	},
	transform: typescriptTransform(
		{
			extensions: [".ts", ".tsx"],
			tsOptions: {
				target: "es2017",
			},
		},
		function customTransform(outputText, file, enc, done) {
			this.parser.parseTransFromString(outputText);
			this.parser.parseFuncFromString(outputText);
			done();
		},
	),
};
