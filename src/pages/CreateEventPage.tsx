import { useState } from "react";
import { createEvent } from "../api/services/events";
import { navigateTo } from "../utils/navigation";

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

export default function CreateEventPage() {
  const [form, setForm] = useState<EventForm>({
    categoryId: 1,
    name: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    registrationDeadline: "",
    capacity: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createEvent({
        ...form,
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        registrationDeadline: new Date(form.registrationDeadline).toISOString(),
      });
      setMessage("Event created successfully ✅");
      navigateTo('/events');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error ❌';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Name"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="categoryId"
          placeholder="Category ID"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="startAt"
          type="datetime-local"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="endAt"
          type="datetime-local"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="registrationDeadline"
          type="datetime-local"
          className="border p-2"
          onChange={handleChange}
        />

        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          className="border p-2"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}