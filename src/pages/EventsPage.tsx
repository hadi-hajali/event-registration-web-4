import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/services/categories";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  setEventActiveState,
  updateEvent,
} from "../api/services/events";
import type { Category } from "../types/category";
import type { Event, EventFormValues, EventListItem } from "../types/event";
import { getErrorMessage } from "../utils/apiError";
import { formatDateTime } from "../utils/formatDate";

type ActiveFilter = "" | "true" | "false";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const emptyForm: EventFormValues = {
  categoryId: 0,
  name: "",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  registrationDeadline: "",
  capacity: 1,
  isActive: true,
};

function toInputDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function toApiDateTime(value: string) {
  return new Date(value).toISOString();
}

function toFormValues(event: Event): EventFormValues {
  return {
    categoryId: event.categoryId,
    name: event.name,
    description: event.description ?? "",
    location: event.location,
    startAt: toInputDateTime(event.startAt),
    endAt: toInputDateTime(event.endAt),
    registrationDeadline: toInputDateTime(event.registrationDeadline),
    capacity: event.capacity,
    isActive: event.isActive,
  };
}

function toPayload(form: EventFormValues): EventFormValues {
  return {
    ...form,
    name: form.name.trim(),
    description: form.description?.trim() || undefined,
    location: form.location.trim(),
    startAt: toApiDateTime(form.startAt),
    endAt: toApiDateTime(form.endAt),
    registrationDeadline: toApiDateTime(form.registrationDeadline),
  };
}

function statusClass(status: EventListItem["eventStatus"]) {
  if (status === "Upcoming") return "bg-blue-100 text-blue-700";
  if (status === "Ongoing") return "bg-green-100 text-green-700";
  return "bg-gray-200 text-gray-700";
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState<EventFormValues>(emptyForm);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories]
  );

  const loadCategories = useCallback(async () => {
    const data = await getCategories();
    setCategories(data);
    setForm((current) => {
      if (current.categoryId !== 0 || data.length === 0) return current;
      const firstActive = data.find((category) => category.isActive);
      return {
        ...current,
        categoryId: firstActive?.id ?? data[0].id,
      };
    });
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEvents({
        page,
        pageSize,
        search: search.trim() || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        isActive:
          activeFilter === "" ? undefined : activeFilter === "true",
        fromDate: fromDate ? toApiDateTime(fromDate) : undefined,
        toDate: toDate ? toApiDateTime(toDate) : undefined,
      });

      setEvents(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(Math.max(response.totalPages, 1));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [
    activeFilter,
    categoryFilter,
    fromDate,
    page,
    pageSize,
    search,
    toDate,
  ]);

  useEffect(() => {
    loadCategories().catch((err) => setError(getErrorMessage(err)));
  }, [loadCategories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEvents();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [loadEvents]);

  function updateForm<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function clearForm() {
    setEditingEventId(null);
    setForm({
      ...emptyForm,
      categoryId: activeCategories[0]?.id ?? categories[0]?.id ?? 0,
    });
  }

  function resetFilters() {
    setSearch("");
    setCategoryFilter("");
    setActiveFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, toPayload(form));
        setSuccessMessage("Event updated successfully.");
      } else {
        await createEvent(toPayload(form));
        setSuccessMessage("Event created successfully.");
      }

      clearForm();
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function startEdit(event: EventListItem) {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const fullEvent = await getEventById(event.id);
      setEditingEventId(event.id);
      setForm(toFormValues(fullEvent));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(event: EventListItem) {
    setError("");
    setSuccessMessage("");

    try {
      await setEventActiveState(event.id, !event.isActive);
      setSuccessMessage(
        event.isActive ? "Event deactivated." : "Event activated."
      );
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(event: EventListItem) {
    const confirmed = window.confirm(
      `Delete "${event.name}"? Events with registrations cannot be deleted.`
    );
    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
      await deleteEvent(event.id);
      setSuccessMessage("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount} event{totalCount === 1 ? "" : "s"} after filters
          </p>
        </div>
      </div>

      {(error || successMessage) && (
        <div
          className={`rounded border p-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {editingEventId ? "Edit Event" : "Create Event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Name
            <input
              required
              maxLength={150}
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Location
            <input
              required
              maxLength={200}
              value={form.location}
              onChange={(e) => updateForm("location", e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Category
            <select
              required
              value={form.categoryId}
              onChange={(e) => updateForm("categoryId", Number(e.target.value))}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            >
              <option value={0} disabled>
                Select active category
              </option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Capacity
            <input
              required
              min={1}
              max={10000}
              type="number"
              value={form.capacity}
              onChange={(e) => updateForm("capacity", Number(e.target.value))}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Starts
            <input
              required
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => updateForm("startAt", e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Ends
            <input
              required
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => updateForm("endAt", e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Registration Deadline
            <input
              required
              type="datetime-local"
              value={form.registrationDeadline}
              onChange={(e) =>
                updateForm("registrationDeadline", e.target.value)
              }
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <label className="flex items-center gap-2 self-end text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateForm("isActive", e.target.checked)}
              className="h-4 w-4"
            />
            Active
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700 lg:col-span-2">
            Description
            <textarea
              maxLength={1000}
              value={form.description ?? ""}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={3}
              className="rounded border border-gray-300 px-3 py-2 font-normal"
            />
          </label>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingEventId
                ? "Update Event"
                : "Create Event"}
            </button>
            {editingEventId && (
              <button
                type="button"
                onClick={clearForm}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name or location"
            className="rounded border border-gray-300 px-3 py-2 text-sm xl:col-span-2"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setPage(1);
              setCategoryFilter(e.target.value);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setPage(1);
              setActiveFilter(e.target.value as ActiveFilter);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All states</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => {
              setPage(1);
              setFromDate(e.target.value);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />

          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => {
              setPage(1);
              setToDate(e.target.value);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
          >
            Reset Filters
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{event.name}</div>
                      <div className="text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-4 py-3">{event.categoryName}</td>
                    <td className="px-4 py-3">
                      <div>{formatDateTime(event.startAt)}</div>
                      <div className="text-gray-500">{formatDateTime(event.endAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{event.availableSeats} available</div>
                      <div className="text-gray-500">
                        {event.activeRegistrationCount} active / {event.capacity}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          event.eventStatus
                        )}`}
                      >
                        {event.eventStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(event)}
                        className={`rounded px-3 py-1 text-xs font-medium ${
                          event.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {event.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEdit(event)}
                          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event)}
                          className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
