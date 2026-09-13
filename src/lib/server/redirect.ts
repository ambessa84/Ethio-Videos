export function safeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = "/profile",
) {
  if (typeof value !== "string") return fallback;

  const path = value.trim();

  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (path.includes("\\")) return fallback;

  return path || fallback;
}

export function profileRedirectPath(redirectTo: string) {
  const params = new URLSearchParams({
    redirectTo,
  });

  return `/profile?${params.toString()}`;
}
