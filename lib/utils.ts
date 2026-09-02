// Creates a URLSearchParams object from a Record and returns a query string. Use this on the server.
export function createQueryString(
	currentParams: Record<string, string | string[] | undefined>,
	updates: Record<string, string | number | null | undefined>,
): string {
	// Flatten nested arrays inside searchParams if present
	const params = new URLSearchParams(
		Object.entries(currentParams).flatMap(([key, value]) =>
			value === undefined
				? []
				: Array.isArray(value)
					? value.map((item) => [key, item])
					: [[key, value]],
		),
	);

	return createQueryStringClient(params, updates);
}

// Can be called directly with URLSearchParams from the client side.
export const createQueryStringClient = (
	searchParams: URLSearchParams,
	updates: Record<string, string | number | null | undefined>,
) => {
	const params = new URLSearchParams(searchParams.toString());

	// Remove all key/value pairs that are null, undefined, or empty strings
	Object.entries(updates).forEach(([key, value]) => {
		if (value === null || value === undefined || value === "") {
			params.delete(key);
		} else {
			params.set(key, value.toString());
		}
	});

	return params.toString();
};
