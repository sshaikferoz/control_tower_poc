'use client';
import React from 'react';
import { Report } from '@/types/app';
import { ReportColumn } from '@/components/Reports/ReportColumn';

interface B2BReportsPageProps {
  reportData: Record<string, Report[]>;
  onAddReport: (category: string) => void;
  onViewReport: (report: Report) => void;
  onEditReport: (report: Report) => void;
  onDeleteReport: (report: Report) => void;
}

export const B2BReportsPage: React.FC<B2BReportsPageProps> = ({
  reportData,
  onAddReport,
  onViewReport,
  onEditReport,
  onDeleteReport,
}) => (
  <div className="flex-1 p-6">
    <div className="mb-6">
      <h1 className="mb-2 text-3xl font-bold text-white">B2B Reports</h1>
      <p className="text-gray-300">
        Manage and view your B2B reporting dashboard
      </p>
    </div>

    <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-6 lg:grid-cols-3">
      <ReportColumn
        title="B2B Reports"
        reports={reportData['B2B Reports'] || []}
        onAddReport={onAddReport}
        onView={onViewReport}
        onEdit={onEditReport}
        onDelete={onDeleteReport}
      />

      <ReportColumn
        title="Inventory & Materials"
        reports={reportData['Inventory & Materials'] || []}
        onAddReport={onAddReport}
        onView={onViewReport}
        onEdit={onEditReport}
        onDelete={onDeleteReport}
      />

      <ReportColumn
        title="Process & Orders"
        reports={reportData['Process & Orders'] || []}
        onAddReport={onAddReport}
        onView={onViewReport}
        onEdit={onEditReport}
        onDelete={onDeleteReport}
      />
    </div>
  </div>
);
