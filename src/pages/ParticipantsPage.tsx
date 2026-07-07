import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { participantsService } from "../api/services/participants";
import { ApiError } from "../types/common";
import type { Participant, ParticipantRequest } from "../types/participant";

const emptyForm: ParticipantRequest = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: null,
  isActive: true,
};

export function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");

  const [form, setForm] = useState<ParticipantRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  async function loadParticipants() {
    try {
      setLoading(true);
      setError(null);

      const result = await participantsService.getAll({
        page,
        pageSize,
        search,
        isActive:
          isActiveFilter === ""
            ? undefined
            : isActiveFilter === "true",
      });

      setParticipants(result.items);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadParticipants();
  }, [page, search, isActiveFilter]);

  function getErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
      return err.data?.message ?? "Request failed.";
    }

    return "Unexpected error occurred.";
  }

  function getFieldErrors(err: unknown): string[] {
    if (err instanceof ApiError) {
      return err.data?.errors ?? [];
    }

    return [];
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors([]);
    setError(null);
  }

  function startEdit(participant: Participant) {
    setEditingId(participant.id);

    setForm({
      fullName: participant.fullName,
      email: participant.email,
      phone: participant.phone,
      dateOfBirth: participant.dateOfBirth,
      isActive: participant.isActive,
    });

    setFieldErrors([]);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setFieldErrors([]);

      const payload: ParticipantRequest = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth || null,
        isActive: form.isActive,
      };

      if (editingId === null) {
        await participantsService.create(payload);
      } else {
        await participantsService.update(editingId, payload);
      }

      resetForm();
      await loadParticipants();
    } catch (err) {
      setError(getErrorMessage(err));
      setFieldErrors(getFieldErrors(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(participant: Participant) {
    const confirmed = window.confirm(
      `Delete participant "${participant.fullName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(participant.id);
      setError(null);

      await participantsService.remove(participant.id);
      await loadParticipants();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Participants
        </h1>
        <p className="text-sm text-gray-600">
          Manage event participants.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId === null ? "Create Participant" : "Edit Participant"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
              Full name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              maxLength={150}
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              maxLength={255}
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              required
              maxLength={30}
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-1 block text-sm font-medium"
            >
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={form.dateOfBirth ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  dateOfBirth: event.target.value || null,
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm({ ...form, isActive: event.target.checked })
                }
              />
              Active
            </label>
          </div>

          {fieldErrors.length > 0 && (
            <div className="md:col-span-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              <ul className="list-disc pl-5">
                {fieldErrors.map((fieldError) => (
                  <li key={fieldError}>{fieldError}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId === null ? "Create" : "Update"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <input
            type="search"
            placeholder="Search name, email, or phone"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2"
          />

          <select
            value={isActiveFilter}
            onChange={(event) => {
              setPage(1);
              setIsActiveFilter(event.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
          </select>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-600">
            Loading participants...
          </div>
        ) : participants.length === 0 ? (
          <div className="py-8 text-center text-gray-600">
            No participants found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Date of birth</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b">
                    <td className="p-3 font-medium">{participant.fullName}</td>
                    <td className="p-3">{participant.email}</td>
                    <td className="p-3">{participant.phone}</td>
                    <td className="p-3">
                      {participant.dateOfBirth ?? "-"}
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          participant.isActive
                            ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                            : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        }
                      >
                        {participant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(participant)}
                          className="rounded-md border border-gray-300 px-3 py-1"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(participant)}
                          disabled={deletingId === participant.id}
                          className="rounded-md bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                        >
                          {deletingId === participant.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}