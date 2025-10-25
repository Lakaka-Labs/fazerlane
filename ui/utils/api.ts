export function buildQuery<T extends Record<string, any>>(
  base: string,
  params?: T
): string {
  if (!params) return base;

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `${base}?${queryString}` : base;
}
