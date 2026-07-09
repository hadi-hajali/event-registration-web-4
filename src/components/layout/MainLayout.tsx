import type { MouseEvent, ReactNode } from "react";
import { navigate } from "../../utils/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {

  function handleNavigate(
    e: MouseEvent<HTMLAnchorElement>,
    path: string
  ) {
    e.preventDefault();
    navigate(path);
  }


  return (
    <div className="min-h-screen bg-slate-100">

      <nav className="bg-white shadow p-4 flex gap-6">

        <a
          href="/"
          onClick={(e) => handleNavigate(e, "/")}
          className="font-bold text-blue-600"
        >
          Dashboard
        </a>


        <a
          href="/categories"
          onClick={(e) =>
            handleNavigate(e, "/categories")
          }
          className="text-gray-600"
        >
          Categories
        </a>


        <a
          href="/events"
          onClick={(e) =>
            handleNavigate(e, "/events")
          }
          className="text-gray-600"
        >
          Events
        </a>


        <a
          href="/participants"
          onClick={(e) =>
            handleNavigate(e, "/participants")
          }
          className="text-gray-600"
        >
          Participants
        </a>


        <a
          href="/registrations"
          onClick={(e) =>
            handleNavigate(e, "/registrations")
          }
          className="text-gray-600"
        >
          Registrations
        </a>


      </nav>


      <div className="p-6">
        {children}
      </div>

    </div>
  );
}