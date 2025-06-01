'use client';
import React, { useState, useCallback } from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import Dashboard from '@/components/Dashboard/Dashboard';
import MappingScreen from '@/app/mapping/page';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { B2BReportsPage } from '@/components/Pages/B2BReportsPage';
import { GenericPage } from '@/components/Pages/GenericPage';
import { ReportModal } from '@/components/Modals/ReportModal';
import { useAppState } from '@/hooks/useAppState';
import { useReportData } from '@/hooks/useReportData';
import { useMenuItems } from '@/hooks/useMenuItems';
import { ModalState, Report } from '@/types/app';

export const IntegratedApp: React.FC = () => {
  const { appState, handleMenuItemSelect, handleNavigateToMapping } =
    useAppState();
  const { reportData, handleReportSave, handleReportDelete } = useReportData();
  const { menuItems, setMenuItems } = useMenuItems();

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: 'add',
  });

  // Handle report actions
  const handleReportView = useCallback((report: Report) => {
    setModal({
      isOpen: true,
      mode: 'view',
      report,
    });
  }, []);

  const handleReportEdit = useCallback((report: Report) => {
    setModal({
      isOpen: true,
      mode: 'edit',
      report,
    });
  }, []);

  const handleReportDeleteAction = useCallback((report: Report) => {
    setModal({
      isOpen: true,
      mode: 'delete',
      report,
    });
  }, []);

  const handleAddReport = useCallback((category: string) => {
    setModal({
      isOpen: true,
      mode: 'add',
      category,
    });
  }, []);

  // Handle modal save with duplicate prevention
  const handleModalSave = useCallback(
    (report: Report) => {
      handleReportSave(report, modal.mode as 'add' | 'edit');
    },
    [modal.mode, handleReportSave],
  );

  // Close modal
  const handleModalClose = useCallback(() => {
    setModal({
      isOpen: false,
      mode: 'add',
    });
  }, []);

  // Render based on current view
  const renderContent = () => {
    switch (appState.view) {
      case 'dashboard':
        return <Dashboard />;

      case 'b2b-reports':
        return (
          <B2BReportsPage
            reportData={reportData}
            onAddReport={handleAddReport}
            onViewReport={handleReportView}
            onEditReport={handleReportEdit}
            onDeleteReport={handleReportDeleteAction}
          />
        );

      case 'generic':
        return (
          <GenericPage
            sectionName={appState.selectedMenuItem}
            onNavigateToMapping={handleNavigateToMapping}
          />
        );

      case 'mapping':
        return <MappingScreen />;

      default:
        return null;
    }
  };

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-[#0a1a35] to-[#1a3a6b]"
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_BSP_NAME}/background/bg.png')`,
      }}
    >
      {appState.view !== 'mapping' && (
        <Sidebar
          selectedItem={appState.selectedMenuItem}
          onItemSelect={handleMenuItemSelect}
          menuItems={menuItems}
          onMenuItemsChange={setMenuItems}
        />
      )}
      {renderContent()}

      <ReportModal
        modal={modal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleReportDelete}
      />
    </div>
  );
};

export default IntegratedApp;
