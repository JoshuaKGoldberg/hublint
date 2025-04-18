import { PartialDeep } from "type-fest";

export function createProxiedObject<T extends object>(
	label: string,
	obj: PartialDeep<T> = {} as PartialDeep<T>,
): T {
	return new Proxy(obj, {
		get(target, property: string) {
			if (property in target) {
				return target[property as keyof typeof target];
			}

			throw new Error(
				`${label} property '${property}' was used but not provided.`,
			);
		},
	}) as T;
}
