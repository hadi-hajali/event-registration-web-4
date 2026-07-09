import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import {
  cancelRegistration,
  createRegistration,
  deleteRegistration,
  getRegistrations,
} from '../api/services/registrations';
import type {
  CreateRegistrationRequest,
  Registration,
  RegistrationFilters,
} from '../types/registration';

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | 1 | 2>('');
  const [eventId, setEventId] = useState<string>('');
  const [participantId, setParticipantId] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formEventId, setFormEventId] = useState('');
  const [formParticipantId, setFormParticipantId] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async (filters: RegistrationFilters) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await getRegistrations(filters);
      const safeRegistrations = Array.isArray(res) ? res : [];
      setRegistrations(safeRegistrations);
      setTotalPages(Math.max(1, Math.ceil(safeRegistrations.length / pageSize)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load registrations.';
      setErrorMessage(message);
      setRegistrations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const filters: RegistrationFilters = {
          page,
          pageSize,
          search,
          status: status === '' ? ('' as const) : status,
          eventId: eventId === '' ? ('' as const) : Number(eventId),
          participantId: participantId === '' ? ('' as const) : Number(participantId),
        };

        const res = await getRegistrations(filters);
        if (!active) return;

        const safeRegistrations = Array.isArray(res) ? res : [];
        setRegistrations(safeRegistrations);
        setTotalPages(Math.max(1, Math.ceil(safeRegistrations.length / pageSize)));
        setErrorMessage('');
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unable to load registrations.';
        setErrorMessage(message);
        setRegistrations([]);
        setTotalPages(1);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchData();

    return () => {
      active = false;
    };
  }, [page, pageSize, search, status, eventId, participantId]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => setStatus((e.target.value === '' ? '' : Number(e.target.value)) as '' | 1 | 2);
  const handleEventIdChange = (e: ChangeEvent<HTMLInputElement>) => setEventId(e.target.value);
  const handleParticipantIdChange = (e: ChangeEvent<HTMLInputElement>) => setParticipantId(e.target.value);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const openCreateForm = () => {
    setFormEventId('');
    setFormParticipantId('');
    setFormNotes('');
    setIsFormOpen(true);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    const eventIdNum = Number(formEventId);
    const participantIdNum = Number(formParticipantId);

    if (!eventIdNum || !participantIdNum) {
      setErrorMessage('Event ID and Participant ID are required and must be numbers.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload: CreateRegistrationRequest = {
      eventId: eventIdNum,
      participantId: participantIdNum,
      notes: formNotes.trim() || undefined,
    };

    try {
      await createRegistration(payload);
      setIsFormOpen(false);
      // refresh list - reset to first page to show new item
      setPage(1);
      void load({ page: 1, pageSize, search, status, eventId: eventId === '' ? '' : Number(eventId), participantId: participantId === '' ? '' : Number(participantId) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create registration.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: number) => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      await cancelRegistration(id);
      void load({ page, pageSize, search, status, eventId: eventId === '' ? '' : Number(eventId), participantId: participantId === '' ? '' : Number(participantId) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to cancel registration.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this registration? This action cannot be undone.')) {
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await deleteRegistration(id);
      void load({ page, pageSize, search, status, eventId: eventId === '' ? '' : Number(eventId), participantId: participantId === '' ? '' : Number(participantId) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete registration.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const safeRegistrations = useMemo(() => (Array.isArray(registrations) ? registrations : []), [registrations]);
  const filtered = useMemo(() => safeRegistrations, [safeRegistrations]);

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.7)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Management</p>
        <h2 className="mt-3 text-3xl font-semibold">Registrations</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Manage event registrations. Create, cancel, and remove registrations backed by the API.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Registration workspace</h3>
            <p className="mt-1 text-sm text-slate-600">Search, filter, and manage registrations.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-48">
              <Input label="Search" placeholder="Search" value={search} onChange={handleSearchChange} />
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <select value={status === '' ? '' : String(status)} onChange={handleStatusChange} className="bg-transparent text-sm">
                <option value="">Any status</option>
                <option value="1">Active</option>
                <option value="2">Cancelled</option>
              </select>
            </label>

            <div className="w-36">
              <Input label="Event ID" placeholder="Event ID" value={eventId} onChange={handleEventIdChange} />
            </div>

            <div className="w-36">
              <Input label="Participant ID" placeholder="Participant ID" value={participantId} onChange={handleParticipantIdChange} />
            </div>

            <Button variant="primary" onClick={openCreateForm}>Create Registration</Button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
        ) : null}

        {isFormOpen ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-slate-900">Create registration</h4>
                <p className="mt-1 text-sm text-slate-600">Create a registration by event and participant IDs.</p>
              </div>
              <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            </div>

            <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleCreate}>
              <div>
                <Input label="Event ID" placeholder="Event ID" value={formEventId} onChange={(e) => setFormEventId(e.target.value)} />
              </div>
              <div>
                <Input label="Participant ID" placeholder="Participant ID" value={formParticipantId} onChange={(e) => setFormParticipantId(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Input label="Notes" placeholder="Notes (optional)" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 md:col-span-3">
                <Button variant="secondary" type="button" onClick={() => setIsFormOpen(false)} disabled={submitting}>Discard</Button>
                <Button variant="primary" type="submit" loading={submitting}>Create</Button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-600">Loading registrations...</div>
          ) : (
            <>
              <Table
                columns={[
                  { header: 'Event', accessor: (item) => <span className="font-medium text-slate-900">{item.eventName} (#{item.eventId})</span> },
                  { header: 'Participant', accessor: (item) => <div className="flex flex-col"><span className="font-medium">{item.participantName}</span><span className="text-sm text-slate-600">{item.participantEmail}</span></div> },
                  { header: 'Status', accessor: (item) => <span className={`rounded-full px-3 py-1 text-sm font-medium ${item.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{item.status === 1 ? 'Active' : 'Cancelled'}</span> },
                  { header: 'Notes', accessor: (item) => <span className="max-w-xs block truncate">{item.notes ?? '—'}</span> },
                  { header: 'Registered', accessor: (item) => <span className="text-sm text-slate-600">{new Date(item.registeredAt).toLocaleString()}</span> },
                  { header: 'Cancelled', accessor: (item) => <span className="text-sm text-slate-600">{item.cancelledAt ? new Date(item.cancelledAt).toLocaleString() : '—'}</span> },
                  { header: 'Actions', accessor: (item) => (
                    <div className="flex flex-wrap gap-2">
                      {item.status === 1 ? (
                        <Button variant="secondary" onClick={() => void handleCancel(item.id)} disabled={submitting}>Cancel</Button>
                      ) : null}
                      <Button variant="danger" onClick={() => void handleDelete(item.id)} disabled={submitting}>Delete</Button>
                    </div>
                  ) },
                ]}
                data={filtered}
                emptyMessage={safeRegistrations.length === 0 ? 'No registrations found.' : 'No results.'}
                emptyDescription={safeRegistrations.length === 0 ? 'Create registrations using the form.' : ''}
                keyExtractor={(item) => item.id}
              />

              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RegistrationsPage;
