import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
  currentPath: string;
}

function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-3 sm:px-4 lg:px-6 lg:py-4">
        <Navbar currentPath={currentPath} />
        <main className="flex-1 px-1 py-5 sm:px-2 lg:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
