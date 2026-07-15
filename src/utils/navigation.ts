export type NavigationItem = {
  label: string;
  path: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Categories", path: "/categories" },
  { label: "Events", path: "/events" },
  { label: "Participants", path: "/participants" },
  { label: "Registrations", path: "/registrations" },
];

export function getCurrentPath(): string {
  const path = window.location.pathname;
  return path === "/" ? "/dashboard" : path;
}

export function navigate(path: string, options?: { replace?: boolean }): void {
  if (options?.replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateTo(path: string): void {
  navigate(path);
}

export function subscribeToLocationChanges(
  onChange: (path: string) => void,
): () => void {
  const handler = () => onChange(getCurrentPath());

  window.addEventListener("popstate", handler);

  return () => window.removeEventListener("popstate", handler);
}