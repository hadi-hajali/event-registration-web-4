import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
  currentPath: string;
}

function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,_#f8fbff_0%,_#eef3ff_45%,_#f7f5ff_100%)] text-slate-800">
      <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute left-[20%] top-[30%] h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-3 sm:px-4 lg:px-6 lg:py-4">
        <Navbar currentPath={currentPath} />
        <main className="flex-1 px-1 pb-6 pt-4 sm:px-2 lg:px-0 lg:pt-6">
          <div className="rounded-[30px] border border-white/70 bg-white/70 p-4 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
