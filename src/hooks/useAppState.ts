import { useState, useCallback } from 'react';
import { AppState, AppView } from '@/types/app';

export const useAppState = () => {
    const [appState, setAppState] = useState<AppState>({
        view: 'dashboard',
        selectedMenuItem: 'My SCM',
    });

    const navigateToView = useCallback((view: AppView, selectedMenuItem: string, mappingParams?: any) => {
        setAppState({
            view,
            selectedMenuItem,
            mappingParams,
        });
    }, []);

    const handleMenuItemSelect = useCallback((item: string) => {
        if (item === 'My SCM') {
            navigateToView('dashboard', item);
        } else if (item === 'B2B Reports') {
            navigateToView('b2b-reports', item);
        } else {
            navigateToView('generic', item);
        }
    }, [navigateToView]);

    const handleNavigateToMapping = useCallback((sectionName: string) => {
        setAppState(prev => ({
            view: 'mapping',
            selectedMenuItem: prev.selectedMenuItem,
            mappingParams: {
                sectionName,
                expanded: 'true',
            },
        }));
    }, []);

    const handleBackNavigation = useCallback(() => {
        if (appState.selectedMenuItem === 'My SCM') {
            navigateToView('dashboard', appState.selectedMenuItem);
        } else if (appState.selectedMenuItem === 'B2B Reports') {
            navigateToView('b2b-reports', appState.selectedMenuItem);
        } else {
            navigateToView('generic', appState.selectedMenuItem);
        }
    }, [appState.selectedMenuItem, navigateToView]);

    return {
        appState,
        setAppState,
        handleMenuItemSelect,
        handleNavigateToMapping,
        handleBackNavigation,
    };
};