import { useState, useCallback } from 'react';
import { Report } from '@/types/app';
import { initialReportData } from '@/constants/app';

export const useReportData = () => {
    const [reportData, setReportData] = useState(initialReportData);

    const handleReportSave = useCallback((report: Report, mode: 'add' | 'edit') => {
        setReportData((prev) => {
            const newData = { ...prev };

            if (mode === 'add') {
                // Check for duplicates to prevent double save
                const existingReport = newData[report.category]?.find(
                    (r) => r.id === report.id,
                );
                if (existingReport) {
                    return prev; // Don't add if already exists
                }

                // Add new report
                if (!newData[report.category]) {
                    newData[report.category] = [];
                }
                newData[report.category].push(report);
            } else if (mode === 'edit') {
                // Edit existing report
                Object.keys(newData).forEach((category) => {
                    const index = newData[category].findIndex(
                        (r) => r.id === report.id,
                    );
                    if (index !== -1) {
                        newData[category][index] = report;
                    }
                });
            }

            return newData;
        });
    }, []);

    const handleReportDelete = useCallback((reportId: string) => {
        setReportData((prev) => {
            const newData = { ...prev };

            Object.keys(newData).forEach((category) => {
                newData[category] = newData[category].filter((r) => r.id !== reportId);
            });

            return newData;
        });
    }, []);

    return {
        reportData,
        setReportData,
        handleReportSave,
        handleReportDelete,
    };
};