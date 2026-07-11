import { useEffect, useState } from 'react';
import { dashboardService } from '../api/services/dashboard';
import type {
  DashboardSummary,
  UpcomingDashboardEvent,
} from '../types/dashboard';

function navigateToEvent(eventId: number) {
  window.history.pushState({}, '', `/events/${eventId}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getSummary();

      setSummary(response);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Failed to load dashboard data.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="space-y-6">
        <DashboardHeader />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <DashboardHeader />

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-900">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="space-y-6">
        <DashboardHeader />

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            No dashboard data available
          </p>

          <p className="mt-2 text-sm text-slate-600">
            The server returned no dashboard summary.
          </p>
        </div>
      </section>
    );
  }

  const summaryCards = [
    {
      label: 'Active Categories',
      value: summary.totalActiveCategories,
      detail: 'Categories currently available for events.',
    },
    {
      label: 'Active Participants',
      value: summary.totalActiveParticipants,
      detail: 'Participants currently active in the system.',
    },
    {
      label: 'Upcoming Events',
      value: summary.totalUpcomingEvents,
      detail: 'Active events scheduled for the future.',
    },
    {
      label: 'Active Registrations',
      value: summary.totalActiveRegistrations,
      detail: 'Registrations that have not been cancelled.',
    },
  ];

  return (
    <section className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Next Upcoming Events
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              The next five active events ordered by start date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.history.pushState({}, '', '/events');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View all events
          </button>
        </div>

        {summary.upcomingEvents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-10 text-center">
            <p className="text-base font-semibold text-slate-900">
              No upcoming events
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Upcoming active events will appear here.
            </p>
          </div>
        ) : (
          <UpcomingEventsTable events={summary.upcomingEvents} />
        )}
      </div>
    </section>
  );
}

function DashboardHeader() {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-7 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)]">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
        Event Registration System
      </p>

      <h2 className="mt-3 text-3xl font-semibold">Dashboard Overview</h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        Review current system totals and monitor the next upcoming events.
      </p>
    </div>
  );
}

interface UpcomingEventsTableProps {
  events: UpcomingDashboardEvent[];
}

function UpcomingEventsTable({ events }: UpcomingEventsTableProps) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <TableHeader>Event</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Start</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Capacity</TableHeader>
            <TableHeader>Registered</TableHeader>
            <TableHeader>Available</TableHeader>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {events.map((event) => (
            <tr
              key={event.id}
              className="cursor-pointer transition hover:bg-slate-50"
              onClick={() => navigateToEvent(event.id)}
            >
              <TableCell>
                <button
                  type="button"
                  className="font-semibold text-slate-900 hover:text-cyan-700"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    navigateToEvent(event.id);
                  }}
                >
                  {event.name}
                </button>
              </TableCell>

              <TableCell>{event.categoryName}</TableCell>

              <TableCell>{formatDateTime(event.startAt)}</TableCell>

              <TableCell>{event.location}</TableCell>

              <TableCell>{event.capacity}</TableCell>

              <TableCell>{event.activeRegistrationCount}</TableCell>

              <TableCell>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    event.availableSeats === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {event.availableSeats}
                </span>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
}

function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
}

function TableCell({ children }: TableCellProps) {
  return (
    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
      {children}
    </td>
  );
}

export default DashboardPage;