import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import EventsPage from "./pages/EventsPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/events/edit/:id" element={<EditEventPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;