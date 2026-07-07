export type NavigationItem = {
  label: string;
  path: string;
};

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Categories', path: '/categories' },
  { label: 'Events', path: '/events' },
  { label: 'Participants', path: '/participants' },
];

export function navigateTo(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
