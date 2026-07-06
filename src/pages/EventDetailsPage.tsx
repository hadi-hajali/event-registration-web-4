import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Event } from "../types/event";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get<Event>(
          `http://localhost:5031/api/events/${id}`
        );

        setEvent(res.data);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading)
    return <div className="p-6">Loading event...</div>;

  if (error)
    return <div className="p-6 text-red-500">{error}</div>;

  if (!event)
    return <div className="p-6">No event found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">
        {event.name}
      </h1>

      {/* INFO CARD */}
      <div className="border rounded p-4 shadow space-y-3">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {event.description}
        </p>

        <p>
          <span className="font-semibold">Location:</span>{" "}
          {event.location}
        </p>

        <p>
          <span className="font-semibold">Category:</span>{" "}
          {event.categoryName}
        </p>

        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(event.startAt).toLocaleString()} →{" "}
          {new Date(event.endAt).toLocaleString()}
        </p>

        {/* STATUS */}
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-white text-sm ${
              event.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {event.isActive ? "Active" : "Inactive"}
          </span>
        </p>

        {/* CAPACITY */}
        <p>
          <span className="font-semibold">Capacity:</span>{" "}
          {event.capacity}
        </p>

        <p>
          <span className="font-semibold">
            Available Seats:
          </span>{" "}
          {event.availableSeats}
        </p>

        <p>
          <span className="font-semibold">
            Active Registrations:
          </span>{" "}
          {event.activeRegistrationCount}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() =>
            navigate(`/events/${id}/registrations`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Registrations
        </button>

        <button
          onClick={() => navigate("/events")}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}