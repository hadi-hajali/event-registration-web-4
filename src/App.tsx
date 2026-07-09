import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import EventsPage from './pages/EventsPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import RegistrationsPage from './pages/RegistrationsPage';

function resolvePage(pathname: string) {
  switch (pathname) {
    case '/':
      return <DashboardPage />;
    case '/categories':
      return <CategoriesPage />;
    case '/events':
      return <EventsPage />;
    case '/participants':
      return <ParticipantsPage />;
    case '/registrations':
      return <RegistrationsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return <AppLayout currentPath={currentPath}>{resolvePage(currentPath)}</AppLayout>;
}
