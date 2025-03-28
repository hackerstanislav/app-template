export interface RouteDefinition<T extends object> {
	url: string;
	vars: T;
	exact: boolean;
}
