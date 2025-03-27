//full app state

export interface State {
	page: null | "home";
}

//modifiers

export type StateRead<T> = [T];
export type StateEdit<T> = [T, (value: Partial<T>) => void];
export type DataStateEdit<A, T> = [A, T, (value: Partial<T>) => void];
