import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/categories':
        return <CategoriesPage />;
      case '/events':
        return <EventsPage />;
      case '/participants':
        return <ParticipantsPage />;
      case '/dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout currentPath={currentPath}>{renderPage()}</AppLayout>;
}

export default App;