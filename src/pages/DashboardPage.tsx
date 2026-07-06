function DashboardPage() {
  const summaryCards = [
    { label: 'Categories', detail: 'Category insights will appear here after integration.' },
    { label: 'Participants', detail: 'Registered participant information will be loaded later.' },
    { label: 'Events', detail: 'Upcoming event details will be displayed once data is available.' },
    { label: 'Registrations', detail: 'Registration activity will be shown after the API is connected.' },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-7 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)]">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Supervisor Preview</p>
        <h2 className="mt-3 text-3xl font-semibold">Dashboard Overview</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          This frontend structure is ready for a real ASP.NET Core and MySQL-driven experience. For now, it presents a polished empty-state dashboard layout.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming data panels</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Event summaries and management cards will appear here once the backend data is available.
          </p>
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center">
            <p className="text-base font-semibold text-slate-900">No records to display yet</p>
            <p className="mt-2 text-sm text-slate-600">Data will appear here after API integration.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Structure Notes</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>• Responsive dashboard layout with refined spacing and card hierarchy.</li>
            <li>• Empty-state presentation designed for future API-driven content.</li>
            <li>• Navigation remains browser-history based and router-free.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
