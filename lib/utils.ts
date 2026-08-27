// creates an URLSearchParams object from a Record and returns a string. Use this on the server.
export function createQueryString(
  currentParams: Record<string, string | string[] | undefined>,
  updates: Record<string, string | number | null | undefined>,
): string {
  //flatmap flattens the arrays inside the searchParams if there are any
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

// can be called directly with URLSearchParams from the client side. 
export const createQueryStringClient = (
  searchParams: URLSearchParams,
  updates: Record<string, string | number | null | undefined>,
) => {
  const params = new URLSearchParams(searchParams.toString());

  // this loop removes all key/value pairs that are null, undefined or ""
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
  });

  return params.toString();
};
