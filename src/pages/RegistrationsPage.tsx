import { useCallback, useEffect, useMemo, useState } from "react";
import { getDashboardSummary } from "../api/services/dashboard";
import { getEventRegistrations } from "../api/services/registrations";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import { RegistrationStatus, type Registration } from "../types/registration";
import type { UpcomingEvent } from "../api/services/dashboard";
import { getErrorMessage } from "../utils/apiError";
import { formatDateTime } from "../utils/formatDate";
import { navigateTo } from "../utils/navigation";

const PAGE_SIZE = 10;

export default function RegistrationsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoadingEvents(true);
      setError("");

      try {
        const response = await getDashboardSummary();
        if (cancelled) return;

        setEvents(response.upcomingEvents);
        setSelectedEventId((current) => current || response.upcomingEvents[0]?.id || "");
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingEvents(false);
        }
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadRegistrations = useCallback(async () => {
    if (selectedEventId === "") {
      setRegistrations([]);
      setTotalPages(1);
      return;
    }

    setLoadingRegistrations(true);
    setError("");

    try {
      const response = await getEventRegistrations(selectedEventId, {
        page,
        pageSize: PAGE_SIZE,
        search: search.trim() || undefined,
        status: statusFilter === "" ? undefined : statusFilter,
      });
      setRegistrations(response.items);
      setTotalPages(Math.max(response.totalPages, 1));
    } catch (err) {
      setError(getErrorMessage(err));
      setRegistrations([]);
      setTotalPages(1);
    } finally {
      setLoadingRegistrations(false);
    }
  }, [page, search, selectedEventId, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRegistrations();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [loadRegistrations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Operations</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Registrations
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Select an event to review registrations using the event-scoped backend endpoint.
          </p>
        </div>
        {selectedEvent && (
          <Button variant="secondary" onClick={() => navigateTo(`/events/${selectedEvent.id}`)}>
            Event Details
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <Card>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_220px] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Event</span>
            <select
              value={selectedEventId}
              disabled={loadingEvents}
              onChange={(e) => {
                setPage(1);
                setSelectedEventId(e.target.value ? Number(e.target.value) : "");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Search"
            placeholder="Participant name or email"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(
                  e.target.value === "" ? "" : (Number(e.target.value) as RegistrationStatus)
                );
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All statuses</option>
              <option value={RegistrationStatus.Active}>Active</option>
              <option value={RegistrationStatus.Cancelled}>Cancelled</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {selectedEvent ? selectedEvent.title : "Event registrations"}
          </h2>
          <p className="text-sm text-slate-500">
            {selectedEvent ? selectedEvent.location : "Choose an event to load registrations."}
          </p>
        </div>

        {loadingEvents || loadingRegistrations ? (
          <div className="p-10 text-center text-sm text-slate-500">Loading registrations...</div>
        ) : selectedEventId === "" ? (
          <EmptyState
            title="Select an event"
            description="Registrations are managed from an event context."
          />
        ) : registrations.length === 0 ? (
          <EmptyState
            title="No registrations found"
            description="Try changing the search or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <Header>Participant</Header>
                  <Header>Email</Header>
                  <Header>Phone</Header>
                  <Header>Status</Header>
                  <Header>Registered</Header>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">
                      {registration.participantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {registration.participantEmail}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {registration.participantPhone}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={registration.status === RegistrationStatus.Active ? "green" : "gray"}>
                        {registration.statusName}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDateTime(registration.registeredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function Header({ children }: { children: string }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-10 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
