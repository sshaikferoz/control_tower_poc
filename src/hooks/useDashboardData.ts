import { useState, useEffect } from 'react';
import { DashboardData } from '@/types/dashboard';

export const useDashboardData = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        sections: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = () => {
            // First try to get from sessionStorage (for saved sections)
            const savedPayload = sessionStorage.getItem('payload');
            if (savedPayload) {
                try {
                    const parsedPayload = JSON.parse(savedPayload);
                    if (Array.isArray(parsedPayload) && parsedPayload.length > 0) {

                        setDashboardData({ sections: parsedPayload });
                        setLoading(false);
                        return;
                    }
                } catch (err) {

                }
            }

            // Fallback to API if no sessionStorage data
            fetch('/api/dashboard')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {

                    // Handle different possible data structures
                    let sections = [];

                    if (Array.isArray(data)) {
                        // If data is directly an array of sections
                        sections = data;
                    } else if (data && Array.isArray(data.sections)) {
                        // If data has a sections property
                        sections = data.sections;
                    } else if (data && typeof data === 'object') {
                        // If data is a single section object, wrap it in an array
                        sections = [data];
                    }

                    // Validate and clean up section data
                    const validSections = sections.filter((section: any) => {
                        return (
                            section && section.sectionName && Array.isArray(section.widgets)
                        );
                    });

                    setDashboardData({ sections: validSections });
                    setLoading(false);
                })
                .catch((err) => {

                    setError('Failed to load dashboard configuration');
                    setLoading(false);
                    // Initialize with empty sections on error
                    setDashboardData({ sections: [] });
                });
        };

        fetchDashboardData();
    }, []);

    const saveDashboard = () => {
        setLoading(true);

        // Create a clean version of the dashboard data for saving
        const dataToSave = {
            sections: dashboardData.sections.map((section) => ({
                sectionName: section.sectionName,
                layout: section.layout,
                fieldMappings: section.fieldMappings || {},
                widgets: section.widgets || [],
                expanded: section.expanded,
            })),
        };

        // Save to sessionStorage first
        try {
            sessionStorage.setItem('payload', JSON.stringify(dataToSave.sections));

        } catch (err) {

        }

        // Save the current dashboard layout to the API
        return fetch('/api/dashboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(() => {
                setLoading(false);

            })
            .catch((err) => {

                setError('Failed to save dashboard configuration');
                setLoading(false);
                throw err;
            });
    };

    return {
        dashboardData,
        setDashboardData,
        loading,
        error,
        saveDashboard,
    };
};