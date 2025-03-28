import { Express } from "express";
import http from "node:http";

export function createServer(app: Express) {
	return http.createServer(app);
}
