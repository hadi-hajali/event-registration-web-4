import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';

function CategoriesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.7)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Management</p>
        <h2 className="mt-3 text-3xl font-semibold">Categories</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Create and organize category definitions for the event registration system. The interface is prepared for future backend integration.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Category workspace</h3>
            <p className="mt-1 text-sm text-slate-600">
              Search, filter, and prepare category actions for future records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-60">
              <Input placeholder="Search categories" disabled />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" disabled />
              Include inactive
            </label>
            <Button variant="primary" disabled>
              Create Category
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Future actions</p>
              <p className="mt-1 text-sm text-slate-600">Create, edit, and delete actions will be enabled once the backend is connected.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                Create
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                Edit
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                Delete
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table
            columns={[]}
            data={[]}
            emptyMessage="No categories to display yet"
            emptyDescription="Categories will appear here after API integration."
          />
        </div>
      </div>
    </section>
  );
}

export default CategoriesPage;
