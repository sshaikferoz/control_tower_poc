'use client';
import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Header from '@/components/Header';
import ChatbotDialog from '@/components/Chat/ChatbotDialog';

interface DashboardHeaderProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSave: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isEditMode,
  onToggleEditMode,
  onSave,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <div className="mb-4 flex w-full items-center justify-between px-8">
      <Header />
      <div className="fixed right-6 bottom-6 z-50 m-2">
        <button
          onClick={openChat}
          className="focus:ring-opacity-50 rounded-full bg-[#83BD01] p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#73a001] focus:ring-4 focus:ring-[#83BD01] focus:outline-none"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3V7a3 3 0 0 1 3 -3h12z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.5 9h.01M14.5 9h.01"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.5 13a3.5 3.5 0 0 0 5 0"
            />
          </svg>
        </button>
      </div>
      <ChatbotDialog isOpen={isChatOpen} onClose={closeChat} />
      <div>
        {isEditMode ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
            className="bg-blue-500"
          >
            Save Layout
          </Button>
        ) : (
          <IconButton
            color="primary"
            onClick={onToggleEditMode}
            className="bg-blue-500"
            aria-label="Edit Layout"
          >
            <EditIcon className="text-white" />
          </IconButton>
        )}
      </div>
    </div>
  );
};
