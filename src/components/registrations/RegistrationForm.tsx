import { useState } from "react";
import ParticipantSearchSelect from "../participants/ParticipantSearchSelect";
import type { Participant } from "../../types/participant";

interface RegistrationFormProps {
  loading: boolean;
  onSubmit: (participantId: number, notes: string) => void;
}

export default function RegistrationForm({
  loading,
  onSubmit,
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
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold">
        Register Participant
      </h2>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Participant
        </label>

        <ParticipantSearchSelect
          value={participant}
          onChange={setParticipant}
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Notes
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Optional notes..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}