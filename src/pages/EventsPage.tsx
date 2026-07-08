import { useEffect, useState } from "react";
import axios from "axios";

type Event = {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline?: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
  isActive: boolean;
  eventStatus: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [capacity, setCapacity] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [editingEventId, setEditingEventId] = useState<number | null>(null);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5031/api/events"
      );

      setEvents(response.data.items);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await axios.post("http://localhost:5031/api/events", {
        categoryId,
        name,
        description,
        location,
        startAt: "2026-08-01T10:00:00",
        endAt: "2026-08-01T12:00:00",
        registrationDeadline: "2026-07-30T10:00:00",
        capacity,
        isActive: true,
      });

      setSuccessMessage("Event created successfully");

      setName("");
      setDescription("");
      setLocation("");
      setCapacity(0);

      fetchEvents();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create event");
    }
  };

  const deleteEvent = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5031/api/events/${id}`
      );

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete event");
    }
  };
const startEdit = (event: Event) => {
  setEditingEventId(event.id);

  setName(event.name);
  setDescription(event.description ?? "");
  setLocation(event.location);
  setCategoryId(event.categoryId);
  setCapacity(event.capacity);
};

const updateEvent = async () => {
  if (!editingEventId) return;

  try {
    setErrorMessage("");
    setSuccessMessage("");

    await axios.put(
      `http://localhost:5031/api/events/${editingEventId}`,
      {
        categoryId,
        name,
        description,
        location,
        startAt: "2026-08-01T10:00:00",
        endAt: "2026-08-01T12:00:00",
        registrationDeadline: "2026-07-30T10:00:00",
        capacity,
        isActive: true,
      }
    );

    setSuccessMessage("Event updated successfully");

    setEditingEventId(null);

    setName("");
    setDescription("");
    setLocation("");
    setCategoryId(1);
    setCapacity(0);

    fetchEvents();
  } catch (error) {
    console.error(error);
    setErrorMessage("Failed to update event");
  }
};
  if (loading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Events</h1>

        <div className="border p-4 mb-6 bg-gray-50 rounded">
         <h2 className="text-xl font-semibold mb-4">
  {editingEventId ? "Edit Event" : "Create Event"}
</h2>

          <div className="grid gap-3">
            <input
              className="border p-3 rounded"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              type="number"
              placeholder="Category Id"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(Number(e.target.value))
              }
            />

            <input
              className="border p-3 rounded"
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) =>
                setCapacity(Number(e.target.value))
              }
            />

          <button
  onClick={
    editingEventId
      ? updateEvent
      : createEvent
  }
  className="bg-blue-600 text-white py-2 rounded"
>
  {editingEventId
    ? "Update Event"
    : "Create Event"}
</button>

            {successMessage && (
              <p className="text-green-600">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p className="text-red-600">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Location</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Seats</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="text-center">
                <td className="border p-3">{event.name}</td>

                <td className="border p-3">
                  {event.categoryName}
                </td>

                <td className="border p-3">
                  {event.location}
                </td>

                <td className="border p-3">
                  {event.eventStatus}
                </td>

                <td className="border p-3">
                  {event.availableSeats} /{" "}
                  {event.capacity}
                </td>

              <td className="border p-3">
  <div className="flex gap-2 justify-center">
    <button
      onClick={() => startEdit(event)}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() => deleteEvent(event.id)}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}