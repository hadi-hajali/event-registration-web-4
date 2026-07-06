import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';

function CategoriesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Content</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Categories</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This section is ready for category records from the future API connection. The current view is intentionally empty and polished.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Category workspace</h3>
            <p className="mt-1 text-sm text-slate-600">Search and management controls will be enabled once the backend is available.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-56">
              <Input placeholder="Search categories" disabled />
            </div>
            <Button variant="primary" disabled>
              Add Category
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Table
            columns={[]}
            data={[]}
            emptyMessage="No categories to display yet"
            emptyDescription="Category records will appear here after API integration."
          />
        </div>
      </div>
    </section>
  );
}

export default CategoriesPage;
