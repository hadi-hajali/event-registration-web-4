import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import CategoriesPage from "./pages/CategoriesPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import RegistrationsPage from "./pages/RegistrationsPage"; // 👈 Make sure this line is present!
function EventDetailsRoute() {
  const { id } = useParams();
  const eventId = Number(id);

  if (!Number.isFinite(eventId)) {
    return (
      <div className="p-6 text-red-600">
        Invalid event id.
      </div>
    );
  }

  return <EventDetailsPage key={eventId} eventId={eventId} />;
}

function App() {

  return (
    <BrowserRouter>

      <div className="bg-gray-800 text-white p-4 flex gap-6">

        <Link to="/dashboard">
          Dashboard
        </Link>


        <Link to="/categories">
          Categories
        </Link>


        <Link to="/events">
          Events
        </Link>


        <Link to="/participants">
          Participants
        </Link>


        <Link to="/registrations">
          Registrations
        </Link>


      </div>



      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/dashboard" />
          }
        />


        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />


        <Route
          path="/categories"
          element={
            <CategoriesPage />
          }
        />


        <Route
          path="/events"
          element={
            <EventsPage />
          }
        />


        <Route
          path="/participants"
          element={
            <ParticipantsPage />
          }
        />


        <Route
          path="/registrations"
          element={
            <RegistrationsPage />
          }
        />


        <Route
          path="/events/:id"
          element={
            <EventDetailsRoute />
          }
        />


      </Routes>


    </BrowserRouter>
  );
}


export default App;
