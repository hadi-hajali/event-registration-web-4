import { useEffect, useState } from "react";

import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import { ParticipantsPage } from "./pages/ParticipantsPage";
import AppLayout from "./components/layout/AppLayout";

import {
  getCurrentPath,
  subscribeToLocationChanges,
} from "./utils/navigation";

function getEventIdFromPath(path: string): number | null {
  const match = path.match(/^\/events\/(\d+)$/);
  if (!match) return null;

  const eventId = Number(match[1]);
  return Number.isFinite(eventId) ? eventId : null;
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    return subscribeToLocationChanges(setCurrentPath);
  }, []);

  const eventId = getEventIdFromPath(currentPath);

  function renderPage() {
  if (eventId !== null) {
    return <EventDetailsPage eventId={eventId} />;
  }

  if (currentPath === "/" || currentPath === "/dashboard") {
    return <DashboardPage />;
  }

  if (currentPath === "/categories") {
    return <CategoriesPage />;
  }

  if (currentPath === "/events") {
    return <EventsPage />;
  }

  if (currentPath === "/participants") {
    return <ParticipantsPage />;
  }

  if (currentPath === "/registrations") {
    return <RegistrationsPage />;
  }

  return <DashboardPage />;
  }

  return (
    <AppLayout currentPath={currentPath}>
      {renderPage()}
    </AppLayout>
  );
}

export default App;
