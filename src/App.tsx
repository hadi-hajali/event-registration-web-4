import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
     <div className="bg-gray-800 text-white p-4 flex gap-6">
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/categories">Categories</Link>
  <Link to="/events">Events</Link>
</div>
      <Routes>
        <Route path="/" element={<Navigate to="/categories" />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;