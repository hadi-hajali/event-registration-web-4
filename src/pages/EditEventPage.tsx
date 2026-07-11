import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type EventForm = {
  categoryId: number;
  name: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
  isActive: boolean;
};

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<EventForm>({
    categoryId: 0,
    name: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    registrationDeadline: "",
    capacity: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH EVENT =================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5031/api/events/${id}`
        );

        setForm(res.data);
      } catch {
        setError("Failed to load event");
      }
    };

    fetchEvent();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  // ================= UPDATE EVENT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:5031/api/events/${id}`,
        form
      );

      navigate("/events");
    } catch {
      setError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
          placeholder="Name"
        />

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2"
          placeholder="Description"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border p-2"
          placeholder="Location"
        />

        <input
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border p-2"
          placeholder="Category ID"
        />

        <input
          type="datetime-local"
          name="startAt"
          value={form.startAt}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="datetime-local"
          name="endAt"
          value={form.endAt}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="datetime-local"
          name="registrationDeadline"
          value={form.registrationDeadline}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          className="border p-2"
        />

        <button
          disabled={loading}
          className="bg-green-600 text-white p-2"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}