'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { ModalState, Report } from '@/types/app';
import { iconOptions } from '@/constants/app';

interface ReportModalProps {
  modal: ModalState;
  onClose: () => void;
  onSave: (report: Report) => void;
  onDelete?: (reportId: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  modal,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(modal.report?.title || '');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (modal.report) {
      setTitle(modal.report.title);
      // Find the icon index based on the current report icon
      const iconIndex = iconOptions.findIndex(
        (option) =>
          option.name === (modal.report?.icon as any)?.type?.name ||
          'DocumentText',
      );
      setSelectedIcon(iconIndex >= 0 ? iconIndex : 0);
    } else {
      setTitle('');
      setSelectedIcon(0);
    }
    setIsSaving(false);
  }, [modal.report, modal.isOpen]);

  const handleSave = useCallback(async () => {
    if (!title.trim() || isSaving) return;

    setIsSaving(true);

    try {
      const IconComponent = iconOptions[selectedIcon].component;
      const newReport: Report = {
        id: modal.report?.id || Date.now().toString(),
        title: title.trim(),
        icon: <IconComponent className="h-5 w-5" />,
        category: modal.category || modal.report?.category || 'B2B Reports',
      };

      onSave(newReport);
      onClose();
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setIsSaving(false);
    }
  }, [title, selectedIcon, modal, onSave, onClose, isSaving]);

  const handleDelete = useCallback(() => {
    if (modal.report && onDelete) {
      onDelete(modal.report.id);
      onClose();
    }
  }, [modal.report, onDelete, onClose]);

  if (!modal.isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a1a35] to-[#1a3a6b]/10">
      <div className="w-full max-w-md rounded-lg border border-[#2a4a7b] bg-[#1a3a6b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {modal.mode === 'add' && 'Add New Report'}
            {modal.mode === 'edit' && 'Edit Report'}
            {modal.mode === 'delete' && 'Delete Report'}
            {modal.mode === 'view' && 'View Report'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {modal.mode === 'delete' ? (
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-white">Are you sure?</p>
                <p className="text-sm text-gray-300">
                  This will permanently delete "{modal.report?.title}".
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : modal.mode === 'view' ? (
          <div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Report Title
              </label>
              <div className="rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white">
                {modal.report?.title}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category
              </label>
              <div className="rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white">
                {modal.report?.category}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white outline-none focus:border-blue-500"
                placeholder="Enter report title"
                disabled={isSaving}
              />
            </div>

            <div className="mb-6 max-h-40 overflow-auto">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !isSaving && setSelectedIcon(index)}
                    disabled={isSaving}
                    className={`rounded border p-3 transition-colors ${
                      selectedIcon === index
                        ? 'border-blue-500 bg-blue-600'
                        : 'border-[#3a5a8b] bg-[#2a4a7b] hover:bg-[#3a5a8b]'
                    } ${isSaving ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
                className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {isSaving
                  ? 'Saving...'
                  : modal.mode === 'add'
                    ? 'Add Report'
                    : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
