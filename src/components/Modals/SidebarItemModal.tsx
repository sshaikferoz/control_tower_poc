'use client';
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SidebarModalState, MenuItem } from '@/types/app';

interface SidebarItemModalProps {
  modal: SidebarModalState;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

export const SidebarItemModal: React.FC<SidebarItemModalProps> = ({
  modal,
  onClose,
  onSave,
}) => {
  const [item, setItem] = useState<MenuItem>(
    modal.item || {
      id: Date.now().toString(),
      name: '',
      description: '',
      hidden: false,
      order: 0,
      type: 'Default',
    },
  );

  useEffect(() => {
    if (modal.item) {
      setItem(modal.item);
    } else {
      setItem({
        id: Date.now().toString(),
        name: '',
        description: '',
        hidden: false,
        order: 0,
        type: 'Default',
      });
    }
  }, [modal.item]);

  const handleSave = () => {
    if (!item.name.trim()) return;
    onSave(item);
    onClose();
  };

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a1a35] to-[#1a3a6b]/10">
      <div className="w-full max-w-md rounded-lg border border-[#2a4a7b] bg-[#1a3a6b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {modal.mode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Title*
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="w-full rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter menu item title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              className="w-full rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              Hidden
            </label>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={item.hidden}
                onChange={(e) => setItem({ ...item, hidden: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-700 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Type*
            </label>
            <select
              value={item.type}
              onChange={(e) => setItem({ ...item, type: e.target.value })}
              className="w-full rounded border border-[#3a5a8b] bg-[#2a4a7b] p-3 text-white outline-none focus:border-blue-500"
            >
              <option value="Default">Select Type</option>
              <option value="Link">Link</option>
              <option value="Tab">Tab</option>
              <option value="Section">Section</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!item.name.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {modal.mode === 'add' ? 'Add Item' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
