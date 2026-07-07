import { navigationItems, navigateTo, type NavigationItem } from '../../utils/navigation.ts';

type NavbarProps = {
  currentPath: string;
};

function Navbar({ currentPath }: NavbarProps) {
  return (
    <header className="sticky top-3 z-10 rounded-[26px] border border-white/80 bg-white/80 px-4 py-3 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.38)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-blue-600/25">
            ER
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-600">
              Event Registration System
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Management Dashboard</h1>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navigationItems.map((item: NavigationItem) => {
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateTo(item.path)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/20'
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
