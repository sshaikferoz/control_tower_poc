import { useState } from 'react';
import { DashboardData } from '@/types/dashboard';

export const useDragAndDrop = (
    dashboardData: DashboardData,
    setDashboardData: (data: DashboardData) => void
) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
        setIsDragging(true);
    };

    const handleDragEnter = (targetIndex: number) => {
        if (
            draggedIndex === null ||
            draggedIndex === targetIndex ||
            !dashboardData?.sections
        )
            return;

        // Create a new array with reordered sections
        const reorderedSections = [...dashboardData.sections];
        const [movedSection] = reorderedSections.splice(draggedIndex, 1);
        reorderedSections.splice(targetIndex, 0, movedSection);

        // Update state with new order
        setDashboardData({ ...dashboardData, sections: reorderedSections });
        setDraggedIndex(targetIndex);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setIsDragging(false);
    };

    const handleDragOver = (index: number) => {
        // Used to enable dropping (handled in the DashboardSection component)
    };

    return {
        draggedIndex,
        isDragging,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        handleDragOver,
    };
};