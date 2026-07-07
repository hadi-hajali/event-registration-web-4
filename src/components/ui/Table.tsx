import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  keyExtractor?: (item: T, index: number) => string | number;
}

function Table<T>({
  columns,
  data,
  emptyMessage = 'No records found.',
  emptyDescription = 'Records will appear here once content is added.',
  className = '',
  keyExtractor,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center ${className}`}>
        <p className="text-base font-semibold text-slate-900">{emptyMessage}</p>
        <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item, index) => (
              <tr key={keyExtractor ? keyExtractor(item, index) : index} className="transition hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={`${index}-${column.header}`} className="px-4 py-3 text-sm text-slate-600">
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
