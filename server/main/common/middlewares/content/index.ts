import express from "express";

export function makeContent() {
	// parsing the incoming data
	return [
		express.json({ limit: "2mb" }),
		express.urlencoded({ extended: true }),
	];
}
