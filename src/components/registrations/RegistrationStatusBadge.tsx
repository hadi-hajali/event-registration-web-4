import type { RegistrationStatus } from "../../types/registration";
import { RegistrationStatus as Status } from "../../types/registration";

interface RegistrationStatusBadgeProps {
  status: RegistrationStatus;
}

export default function RegistrationStatusBadge({
  status,
}: RegistrationStatusBadgeProps) {
  const isActive = status === Status.Active;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Cancelled"}
    </span>
  );
}