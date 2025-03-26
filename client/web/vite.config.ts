/// <reference types="vitest" />
import { defineConfig } from "vite";
import viteEnvironmentPlugin from "vite-plugin-environment";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

import dotenv from "dotenv";
dotenv.config();

const VITE_GA_ID = process.env.VITE_GA_ID ?? null;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteEnvironmentPlugin(
			{
				...(VITE_GA_ID ? { VITE_GA_ID } : {}),
			},
			{ defineOn: "import.meta.env" },
		),
		mkcert(),
	],
	define: {
		global: {},
	},
	assetsInclude: ["**/*.png", "**/*.jpg"],
	server: {
		https: {},
		proxy: {
			"/api": {
				target: "http://localhost:5001",
				changeOrigin: true,
			},
			"/auth": {
				target: "http://localhost:5001",
				changeOrigin: true,
			},
			"/socket.io": {
				target: "ws://localhost:5001",
				ws: true,
			},
		},
	},
	test: {
		include: ["**/*.specs.?(c|m)[jt]s?(x)"],
		environment: "jsdom",
	},
});
