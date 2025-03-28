// (C) 2023 GoodData Corporation

export type Deffered<T> = Promise<T> & {
	resolve: (value: T) => Deffered<T>;
	reject: (reason: Error) => Deffered<T>;
	touch: () => void;
	resolved: boolean;
};

export function deferred<T>(): Deffered<T> {
	let resolve: (value: T) => void;
	let reject: (reason?: Error) => void;
	let touch = 0;

	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	}) as Deffered<T>;

	promise.resolved = false;
	promise.resolve = (value: T) => {
		if (touch > 0) {
			touch--;
			return promise;
		}
		promise.resolved = true;
		resolve(value);
		return promise;
	};
	promise.reject = (err) => {
		touch = 0;
		promise.resolved = true;
		reject(err);
		return promise;
	};
	promise.touch = () => {
		if (promise.resolved) {
			throw new Error(`Can not touch resolved deffered promise.`);
		}
		touch++;
	};

	return promise;
}
