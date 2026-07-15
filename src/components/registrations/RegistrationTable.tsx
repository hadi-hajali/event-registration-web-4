import { RegistrationStatus, type Registration } from "../../types/registration";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import Button from "../ui/Button";

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
      <div className="rounded-2xl border border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
        Loading registrations...
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
        <p className="font-semibold text-slate-900">No registrations found</p>
        <p className="mt-2 text-sm text-slate-500">Registrations will appear here after participants enroll.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Participant
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Phone
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Registered At
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {registrations.map((registration) => (
            <tr key={registration.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                {registration.participantName}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {registration.participantEmail}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {registration.participantPhone}
              </td>

              <td className="px-4 py-3">
                <RegistrationStatusBadge
                  status={registration.status}
                />
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {formatDateTime(registration.registeredAt)}
              </td>

              <td className="px-4 py-3 text-right">
                {registration.status === RegistrationStatus.Active && (
                  <Button
                    variant="danger"
                    onClick={() => onCancel(registration.id)}
                    disabled={!!cancelDisabledReason}
                    title={cancelDisabledReason ?? undefined}
                    className="px-3 py-2"
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
