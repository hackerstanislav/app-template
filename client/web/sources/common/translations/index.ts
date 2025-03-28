import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../languages/en.json";

void i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
	},
	lng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;

export * from "./Components";
