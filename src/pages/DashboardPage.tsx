import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  type DashboardSummary,
  type UpcomingEvent,
} from "../api/services/dashboard";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { formatDateTime } from "../utils/formatDate";
import { navigateTo } from "../utils/navigation";

const kpiItems = [
  {
    label: "Active Categories",
    key: "totalActiveCategories",
    icon: "CA",
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Active Events",
    key: "totalActiveEvents",
    icon: "EV",
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "Active Participants",
    key: "totalActiveParticipants",
    icon: "PT",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Active Registrations",
    key: "totalActiveRegistrations",
    icon: "RG",
    tone: "bg-amber-50 text-amber-700",
  },
] satisfies Array<{
  label: string;
  key: keyof Pick<
    DashboardSummary,
    | "totalActiveCategories"
    | "totalActiveEvents"
    | "totalActiveParticipants"
    | "totalActiveRegistrations"
  >;
  icon: string;
  tone: string;
}>;

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboardSummary();
        if (!cancelled) {
          setSummary(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingEvents = summary?.upcomingEvents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Monitor active inventory, registration activity, and the next events on the calendar.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <Card key={item.key} className="min-h-32">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {loading ? "..." : summary?.[item.key] ?? 0}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${item.tone}`}
              >
                {item.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Upcoming Events</h2>
            <p className="text-sm text-slate-500">The next active events sorted by start date.</p>
          </div>
          <Badge tone="blue">{upcomingEvents.length} scheduled</Badge>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Loading upcoming events...
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-base font-semibold text-slate-900">No upcoming events</p>
            <p className="mt-2 text-sm text-slate-500">
              Active upcoming events will appear here when they are available.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <HeaderCell>Event</HeaderCell>
                    <HeaderCell>Category</HeaderCell>
                    <HeaderCell>Starts</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Capacity</HeaderCell>
                    <HeaderCell>Registered</HeaderCell>
                    <HeaderCell>Available</HeaderCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {upcomingEvents.map((event) => (
                    <UpcomingEventRow key={event.id} event={event} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function HeaderCell({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function UpcomingEventRow({ event }: { event: UpcomingEvent }) {
  const availableSeats = Math.max(0, event.capacity - event.registeredCount);

  return (
    <tr
      className="cursor-pointer transition hover:bg-indigo-50/40"
      onClick={() => navigateTo(`/events/${event.id}`)}
    >
      <td className="px-4 py-4 text-sm font-semibold text-slate-950">
        {event.title}
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{event.categoryName}</td>
      <td className="px-4 py-4 text-sm text-slate-600">
        {formatDateTime(event.startDate)}
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{event.location}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{event.capacity}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{event.registeredCount}</td>
      <td className="px-4 py-4">
        <Badge tone={availableSeats > 0 ? "green" : "red"}>{availableSeats}</Badge>
      </td>
    </tr>
  );
}
