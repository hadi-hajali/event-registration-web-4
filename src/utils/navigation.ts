export function getCurrentPath(): string {
  return window.location.pathname;
}

// 💡 Adding this fallback alias because your App.tsx is looking for 'currentPage'
export const currentPage = window.location.pathname;

export function navigate(path: string, options?: { replace?: boolean }): void {
  if (options?.replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function subscribeToLocationChanges(onChange: (path: string) => void): () => void {
  const handler = () => onChange(getCurrentPath());
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}