'use client';
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Report } from '@/types/app';
import { ReportCard } from './ReportCard';

interface ReportColumnProps {
  title: string;
  reports: Report[];
  onAddReport: (category: string) => void;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onDelete: (report: Report) => void;
}

export const ReportColumn: React.FC<ReportColumnProps> = ({
  title,
  reports,
  onAddReport,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="h-full rounded-lg bg-[#0f2a4f] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <button
        onClick={() => onAddReport(title)}
        className="flex items-center space-x-1 rounded bg-[#4CAF50] px-3 py-1 text-sm text-white transition-colors hover:bg-[#45a049]"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Add</span>
      </button>
    </div>

    <div className="max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto pr-2">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);
