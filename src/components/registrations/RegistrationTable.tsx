import { RegistrationStatus, type Registration } from "../../types/registration";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import { formatDateTime } from "../../utils/formatDate";

interface RegistrationTableProps {
  registrations: Registration[];
  loading: boolean;
  onCancel: (registrationId: number) => void;
  // When set, cancel is disabled for every row and this reason is shown
  // as a tooltip (e.g. "The event has already started").
  cancelDisabledReason?: string | null;
}

export default function RegistrationTable({
  registrations,
  loading,
  onCancel,
  cancelDisabledReason,
}: RegistrationTableProps) {
  if (loading) {
    return (
      <div className="py-6 text-center text-gray-500">
        Loading registrations...
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No registrations found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Participant
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Email
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Registered At
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <td className="px-4 py-3">
                {registration.participantName}
              </td>

              <td className="px-4 py-3">
                {registration.participantEmail}
              </td>

              <td className="px-4 py-3">
                {registration.participantPhone}
              </td>

              <td className="px-4 py-3">
                <RegistrationStatusBadge
                  status={registration.status}
                />
              </td>

              <td className="px-4 py-3">
                {formatDateTime(registration.registeredAt)}
              </td>

              <td className="px-4 py-3 text-center">
                {registration.status === RegistrationStatus.Active && (
                  <button
                    onClick={() => onCancel(registration.id)}
                    disabled={!!cancelDisabledReason}
                    title={cancelDisabledReason ?? undefined}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}