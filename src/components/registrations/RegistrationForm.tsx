import { useState } from "react";
import ParticipantSearchSelect from "../participants/ParticipantSearchSelect";
import Button from "../ui/Button";
import type { Participant } from "../../types/participant";

interface RegistrationFormProps {
  loading: boolean;
  onSubmit: (participantId: number, notes: string) => void;
  disabled?: boolean;
  disabledReason?: string | null;
}

export default function RegistrationForm({
  loading,
  onSubmit,
  disabled = false,
  disabledReason,
}: RegistrationFormProps) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!participant) {
      alert("Please select a participant.");
      return;
    }

    onSubmit(participant.id, notes);

    setParticipant(null);
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Register Participant</h2>
        <p className="mt-1 text-sm text-slate-500">
          Search for an active participant and add optional notes.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Participant
        </label>

        <ParticipantSearchSelect
          value={participant}
          onChange={setParticipant}
          disabled={loading || disabled}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Notes
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
          placeholder="Optional notes..."
        />
      </div>

      {disabledReason && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          {disabledReason}
        </p>
      )}

      <Button type="submit" loading={loading} disabled={disabled}>
        Register
      </Button>
    </form>
  );
}
