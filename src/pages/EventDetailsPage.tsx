import { useEffect, useState } from "react";
import type { Event } from "../types/event";
import { getEventById } from "../api/services/events";
import {
  getEventRegistrations,
  createRegistration,
  cancelRegistration,
} from "../api/services/registrations";
import {
  RegistrationStatus,
  type Registration,
} from "../types/registration";
import RegistrationTable from "../components/registrations/RegistrationTable";
import RegistrationForm from "../components/registrations/RegistrationForm";
import CancelRegistrationDialog from "../components/registrations/CancelRegistrationDialog";
import { getErrorMessage } from "../utils/apiError";
import { formatDate, formatDateTime } from "../utils/formatDate";

interface EventDetailsPageProps {
  eventId: number;
}

const PAGE_SIZE = 10;

export default function EventDetailsPage({ eventId }: EventDetailsPageProps) {
  // Event
  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Registrations list
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(true);
  const [registrationsError, setRegistrationsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "">("");

  // Register form
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Cancel dialog
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function loadEvent() {
    setEventLoading(true);
    setEventError(null);
    try {
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (err) {
      setEventError(getErrorMessage(err));
    } finally {
      setEventLoading(false);
    }
  }

  async function loadRegistrations() {
    setRegistrationsLoading(true);
    setRegistrationsError(null);
    try {
      const data = await getEventRegistrations(eventId, {
        page,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter === "" ? undefined : statusFilter,
      });
      setRegistrations(data?.items || []);
      setTotalPages(Math.max(data?.totalPages || 1, 1));
    } catch (err) {
      setRegistrationsError(getErrorMessage(err));
      setRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEvent();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadRegistrations();
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [page, search, statusFilter]);

  async function handleRegister(participantId: number, notes: string) {
    setRegistering(true);
    setRegisterError(null);
    try {
      await createRegistration(eventId, {
        participantId,
        notes: notes || undefined,
      });
      setPage(1);
      await Promise.all([loadEvent(), loadRegistrations()]);
    } catch (err) {
      setRegisterError(getErrorMessage(err));
    } finally {
      setRegistering(false);
    }
  }

  function handleCancelClick(registrationId: number) {
    setCancelError(null);
    setCancelTargetId(registrationId);
  }

  function handleCloseCancelDialog() {
    if (cancelling) return;
    setCancelTargetId(null);
    setCancelError(null);
  }

  async function handleConfirmCancel() {
    if (cancelTargetId === null) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelRegistration(cancelTargetId);
      setCancelTargetId(null);
      await Promise.all([loadEvent(), loadRegistrations()]);
    } catch (err) {
      setCancelError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  const eventHasStarted = event ? event.eventStatus !== "Upcoming" : false;
  const cancelDisabledReason = eventHasStarted
    ? "Cannot cancel a registration after the event has started."
    : null;

  if (eventLoading) {
    return <div className="py-10 text-center text-gray-500">Loading event...</div>;
  }

  if (eventError || !event) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {eventError ?? "Event not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {event.categoryName} • {event.location}
            </p>
          </div>
          <span
            className={`inline-flex h-fit rounded-full px-3 py-1 text-xs font-medium ${
              event.eventStatus === "Upcoming"
                ? "bg-blue-100 text-blue-700"
                : event.eventStatus === "Ongoing"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {event.eventStatus}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-gray-500">Starts</dt>
            <dd className="font-medium">{formatDateTime(event.startAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Ends</dt>
            <dd className="font-medium">{formatDateTime(event.endAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Registration Deadline</dt>
            <dd className="font-medium">
              {event.registrationDeadline ? formatDate(event.registrationDeadline) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Seats</dt>
            <dd className="font-medium">
              {event.activeRegistrationCount} / {event.capacity}{" "}
              <span className="text-gray-400">({event.availableSeats} available)</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Register a participant */}
      <div>
        <RegistrationForm loading={registering} onSubmit={handleRegister} />
        {registerError && <p className="mt-2 text-sm text-red-600">{registerError}</p>}
      </div>

      {/* Registrations list */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Registrations</h2>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search by participant name or email..."
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(
                  e.target.value === "" ? "" : (Number(e.target.value) as RegistrationStatus)
                );
              }}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              <option value={RegistrationStatus.Active}>Active</option>
              <option value={RegistrationStatus.Cancelled}>Cancelled</option>
            </select>
          </div>
        </div>

        {registrationsError ? (
          <p className="text-sm text-red-600">{registrationsError}</p>
        ) : (
          <>
            <RegistrationTable
              registrations={registrations}
              loading={registrationsLoading}
              onCancel={handleCancelClick}
              cancelDisabledReason={cancelDisabledReason}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CancelRegistrationDialog
        open={cancelTargetId !== null}
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseCancelDialog}
      />
      {cancelError && <p className="text-center text-sm text-red-600">{cancelError}</p>}
    </div>
  );
}