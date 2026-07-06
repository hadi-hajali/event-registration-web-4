import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';

function ParticipantsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Content</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Participants</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This view is prepared for future participant records from the real backend. It currently displays a refined empty state.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Participant records</h3>
            <p className="mt-1 text-sm text-slate-600">Search and export actions will be enabled once live data is available.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-56">
              <Input placeholder="Search participants" disabled />
            </div>
            <Button variant="secondary" disabled>
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Table
            columns={[]}
            data={[]}
            emptyMessage="No participants to display yet"
            emptyDescription="Participant records will appear here after API integration."
          />
        </div>
      </div>
    </section>
  );
}

export default ParticipantsPage;
