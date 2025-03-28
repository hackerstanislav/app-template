export function builder(route: string) {
	//replace all the variables with the express format
	const url = `/api${route.replace(/\{([^}]+)}/g, ":$1")}`;

	return {
		url,
	};
}
