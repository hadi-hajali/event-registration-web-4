import type { MouseEvent, ReactNode } from "react";
import { navigate } from "../../utils/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  function handleNavigate(e: MouseEvent<HTMLAnchorElement>, path: string) {
    e.preventDefault();
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow p-4 flex gap-4">
        <a href="/" onClick={(e) => handleNavigate(e, "/")} className="font-bold text-blue-600">
          Home
        </a>
        <a href="/events/1" onClick={(e) => handleNavigate(e, "/events/1")} className="text-gray-600">
          Event Details
        </a>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}