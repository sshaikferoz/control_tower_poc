'use client';
import React, { useState } from 'react';
import { CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import NewsFeed from '@/widgets/NewsFeed';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSection } from './DashboardSection';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import mirageServer from '@/lib/mirage/mirageServer';

// Initialize Mirage server
mirageServer();

export default function Dashboard() {
  const { dashboardData, setDashboardData, loading, error, saveDashboard } =
    useDashboardData();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const { handleDragStart, handleDragEnter, handleDragEnd, handleDragOver } =
    useDragAndDrop(dashboardData, setDashboardData);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    saveDashboard()
      .then(() => {
        setIsEditMode(false);
        setShowSaveSuccess(true);
      })
      .catch((err) => {});
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
        <div className="ml-4 text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-500 p-4 text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex min-h-screen">{/* <Sidebar /> */}</div>
      <div className="relative min-h-screen w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_BSP_NAME}/background/bg.png')`,
          }}
        ></div>

        <div className="relative z-10 flex max-h-screen flex-col overflow-y-auto text-white">
          <DashboardHeader
            isEditMode={isEditMode}
            onToggleEditMode={toggleEditMode}
            onSave={handleSave}
          />

          <div className="mx-auto flex w-full flex-col items-start gap-7 px-6 py-6">
            <NewsFeed />
          </div>

          {/* Empty state if no sections */}
          {!dashboardData?.sections || dashboardData.sections.length === 0 ? (
            <div className="flex h-[60vh] flex-col items-center justify-center">
              <Typography variant="h5" className="mb-4 text-white">
                No dashboard sections found
              </Typography>
              <Typography className="text-white">
                {`Create a "new section" by clicking "Create Section" in the header`}
              </Typography>
            </div>
          ) : (
            /* Render all sections with native HTML5 drag and drop */
            <div className="flex flex-col">
              {dashboardData?.sections?.map((section, index) => (
                <DashboardSection
                  key={`section-${index}`}
                  section={section}
                  index={index}
                  isEditMode={isEditMode}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success notification */}
      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Dashboard layout saved successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
