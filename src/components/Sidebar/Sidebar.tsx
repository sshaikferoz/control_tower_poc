'use client';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  CheckIcon,
  PlusIcon,
  Bars3Icon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import PSCLogo from '@/assets/PSCLogo';
import { MenuItem, SidebarModalState } from '@/types/app';
import { SidebarItemModal } from '@/components/Modals/SidebarItemModal';

interface SidebarProps {
  selectedItem: string;
  onItemSelect: (item: string) => void;
  menuItems: MenuItem[];
  onMenuItemsChange: (items: MenuItem[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedItem,
  onItemSelect,
  menuItems,
  onMenuItemsChange,
}) => {
  const [search, setSearch] = useState<string>('');
  const [sidebarModal, setSidebarModal] = useState<SidebarModalState>({
    isOpen: false,
    mode: 'add',
  });
  const [editMode, setEditMode] = useState(false);
  const [tempItems, setTempItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setTempItems([...menuItems]);
  }, [menuItems]);

  const handleAddItem = () => {
    setSidebarModal({
      isOpen: true,
      mode: 'add',
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setSidebarModal({
      isOpen: true,
      mode: 'edit',
      item,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    onMenuItemsChange(menuItems.filter((item) => item.id !== itemId));
  };

  const handleSaveItem = (item: MenuItem) => {
    if (sidebarModal.mode === 'add') {
      onMenuItemsChange([...menuItems, item]);
    } else {
      onMenuItemsChange(menuItems.map((i) => (i.id === item.id ? item : i)));
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Save changes when exiting edit mode
      onMenuItemsChange(tempItems);
    }
    setEditMode(!editMode);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tempItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property based on new position
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setTempItems(updatedItems);
  };

  const toggleItemVisibility = (itemId: string) => {
    setTempItems(
      tempItems.map((item) =>
        item.id === itemId ? { ...item, hidden: !item.hidden } : item,
      ),
    );
  };

  const filteredItems = editMode
    ? tempItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : tempItems
        .filter((item) => !item.hidden)
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-[#00214E] to-[#0164B0] p-4 text-white">
      <div className="flex flex-row items-center space-x-2">
        <PSCLogo />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">P&SC</h1>
          <h1 className="text-lg font-semibold">Intelligent Centre</h1>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative mr-2 flex-1">
          <MagnifyingGlassIcon className="absolute top-3 left-3 h-5 w-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search Menu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md bg-[#ffffff20] p-2 pl-10 text-white placeholder-gray-300 outline-none"
          />
        </div>
        <button
          onClick={toggleEditMode}
          className={`rounded-md p-2 ${
            editMode
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
          title={editMode ? 'Save Changes' : 'Edit Menu'}
        >
          {editMode ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <PencilIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {editMode && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-1 rounded bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700"
          >
            <PlusIcon className="h-3 w-3" />
            <span>Add Item</span>
          </button>
        </div>
      )}

      <nav className="mt-2 flex-grow">
        <DragDropContext onDragEnd={editMode ? onDragEnd : () => {}}>
          <Droppable droppableId="sidebarItems">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-1"
              >
                {filteredItems.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={!editMode}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex cursor-pointer items-center rounded px-3 py-2 transition-colors ${
                          selectedItem === item.name
                            ? 'bg-white text-black'
                            : 'text-white hover:bg-[#ffffff30]'
                        }`}
                        onClick={() => !editMode && onItemSelect(item.name)}
                      >
                        {editMode && (
                          <div
                            {...provided.dragHandleProps}
                            className="mr-2 text-gray-300 hover:text-white"
                          >
                            <Bars3Icon className="h-4 w-4" />
                          </div>
                        )}
                        <span className="flex-1">{item.name}</span>
                        {editMode && (
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemVisibility(item.id);
                              }}
                              className={`rounded p-1 ${
                                item.hidden
                                  ? 'bg-gray-600 hover:bg-gray-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } transition-colors`}
                              title={item.hidden ? 'Show' : 'Hide'}
                            >
                              <EyeIcon className="h-3 w-3 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditItem(item);
                              }}
                              className="rounded bg-yellow-600 p-1 transition-colors hover:bg-yellow-700"
                              title="Edit"
                            >
                              <PencilIcon className="h-3 w-3 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                              className="rounded bg-red-600 p-1 transition-colors hover:bg-red-700"
                              title="Delete"
                            >
                              <TrashIcon className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </nav>

      <div className="mt-auto flex items-center space-x-3 rounded bg-[#ffffff20] p-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
          <span className="text-sm font-semibold text-white">AM</span>
        </div>
        <div>
          <p className="text-sm font-medium">Abdulmajeed</p>
          <p className="text-xs text-gray-300">
            Last Login: 12/11/2024 19:23:32
          </p>
        </div>
      </div>

      <SidebarItemModal
        modal={sidebarModal}
        onClose={() => setSidebarModal({ ...sidebarModal, isOpen: false })}
        onSave={handleSaveItem}
      />
    </div>
  );
};
