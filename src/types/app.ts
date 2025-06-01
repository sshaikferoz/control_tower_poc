import React from 'react';

export type AppView = 'dashboard' | 'mapping' | 'b2b-reports' | 'generic';

export interface AppState {
    view: AppView;
    selectedMenuItem: string;
    mappingParams?: {
        sectionName: string;
        expanded: string;
    };
}

export interface Report {
    id: string;
    title: string;
    icon: React.ReactNode;
    category: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    hidden: boolean;
    order: number;
    type: string;
}

export interface ModalState {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'delete' | 'view';
    report?: Report;
    category?: string;
}

export interface SidebarModalState {
    isOpen: boolean;
    mode: 'add' | 'edit';
    item?: MenuItem;
}

export interface IconOption {
    name: string;
    icon: React.ReactNode;
    component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}