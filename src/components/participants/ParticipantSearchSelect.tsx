import { useEffect, useRef, useState } from "react";
import { getParticipants } from "../../api/services/participants";
import type { Participant } from "../../types/participant";
import { getErrorMessage } from "../../utils/apiError";

interface ParticipantSearchSelectProps {
  value: Participant | null;
  onChange: (participant: Participant | null) => void;
  disabled?: boolean;
}

export default function ParticipantSearchSelect({
  value,
  onChange,
  disabled,
}: ParticipantSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Participant[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getParticipants({
          search: query || undefined,
          isActive: true,
        });
        setResults(data.slice(0, 10));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, open]);

  function handleSelect(participant: Participant) {
    onChange(participant);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        disabled={disabled}
        value={value ? `${value.fullName} (${value.email})` : query}
        onChange={(e) => {
          onChange(null);
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search participant by name, email or phone..."
        className="w-full rounded border border-gray-300 px-3 py-2"
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
          {loading ? (
            <p className="p-2 text-sm text-gray-500">Searching...</p>
          ) : error ? (
            <p className="p-2 text-sm text-red-600">{error}</p>
          ) : results.length === 0 ? (
            <p className="p-2 text-sm text-gray-500">No participants found.</p>
          ) : (
            results.map((participant) => (
              <button
                key={participant.id}
                type="button"
                onClick={() => handleSelect(participant)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
              >
                {participant.fullName} — {participant.email}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}