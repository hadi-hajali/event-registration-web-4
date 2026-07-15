import Button from "../ui/Button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-950">
          Cancel Registration
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to cancel this registration?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            No
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
