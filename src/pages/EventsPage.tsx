import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../api/services/eventsService";
import type { EventListItem } from "../types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const data = await getEvents({
          search: search || undefined,
          categoryId,
          isActive,
          page,
          pageSize,
        });

        setEvents(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, categoryId, isActive, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="border p-2 rounded w-32"
          placeholder="Category ID"
          value={categoryId ?? ""}
          onChange={(e) =>
            setCategoryId(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />

        <select
          className="border p-2 rounded"
          value={
            isActive === undefined
              ? ""
              : isActive
              ? "true"
              : "false"
          }
          onChange={(e) =>
            setIsActive(
              e.target.value === ""
                ? undefined
                : e.target.value === "true"
            )
          }
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Seats</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="text-center">
                  <td className="border p-2">{ev.name}</td>

                  <td className="border p-2">
                    {ev.categoryName}
                  </td>

                  <td className="border p-2">
                    {new Date(ev.startAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        ev.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {ev.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="border p-2">
                    {ev.availableSeats} / {ev.capacity}
                  </td>

                  {/* ACTIONS */}
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          navigate(`/events/${ev.id}`)
                        }
                        className="bg-gray-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          navigate(`/events/edit/${ev.id}`)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1">Page {page}</span>

        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}