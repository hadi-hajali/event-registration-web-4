import { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import EventDetailsPage from "./pages/EventDetailsPage";
import { getCurrentPath, navigate, subscribeToLocationChanges } from "./utils/navigation";

function resolveEventId(path: string): number {
  const match = path.match(/^\/events\/(\d+)$/);
  return match ? Number(match[1]) : 1;
}

function App() {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    return subscribeToLocationChanges(setPath);
  }, []);

  useEffect(() => {
    if (path === "/") {
      navigate("/events/1", { replace: true });
    }
  }, [path]);

  const eventId = resolveEventId(path);

  return (
    <MainLayout>
      <EventDetailsPage key={eventId} eventId={eventId} />
    </MainLayout>
  );
}

export default App;