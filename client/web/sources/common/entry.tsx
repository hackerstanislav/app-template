import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./translations";

import { setupEnv } from "./env";
import App from "./App";

const element = document.getElementById("root");
// NOTE: This is a main render of the application, react root is created and the App component is rendered
// in html element with id 'root'
if (element) {
	//We need to setup the environment variables
	setupEnv();

	//We need to render the application
	createRoot(element).render(<App />);
}
