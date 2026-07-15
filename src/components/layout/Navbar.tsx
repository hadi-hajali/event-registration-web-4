import { navigationItems, navigateTo, type NavigationItem } from '../../utils/navigation.ts';

type NavbarProps = {
  currentPath: string;
};

function Navbar({ currentPath }: NavbarProps) {
  return (
    <header className="sticky top-3 z-10 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm">
            ER
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Event Registration System
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Admin Console</h1>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navigationItems.map((item: NavigationItem) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/events" && currentPath.startsWith("/events/"));

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateTo(item.path)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
