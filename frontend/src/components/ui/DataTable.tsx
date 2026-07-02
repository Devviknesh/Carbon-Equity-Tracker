import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T extends { id?: number | string }> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T extends { id?: number | string }>({
  columns, data, pageSize = 8, emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const slice = data.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-white/6">
        <table className="w-full saas-table text-left">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={String(col.key)} className={col.align === 'right' ? 'text-right' : ''}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length > 0 ? (
              slice.map((row, i) => (
                <motion.tr
                  key={row.id ?? i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {columns.map(col => (
                    <td key={String(col.key)} className={col.align === 'right' ? 'text-right' : ''}>
                      {col.render
                        ? col.render(row)
                        : String((row as any)[col.key] ?? '—')}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <span>{data.length} records · Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
