interface CancelRegistrationDialogProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelRegistrationDialog({
  open,
  loading,
  onConfirm,
  onClose,
}: CancelRegistrationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          Cancel Registration
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to cancel this registration?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}