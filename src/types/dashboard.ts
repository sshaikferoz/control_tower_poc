export interface SectionProps {
    section: any;
    index: number;
    isEditMode: boolean;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    onDragOver: (index: number) => void;
}

export interface DashboardData {
    sections: any[];
}

export interface WidgetProps {
    [key: string]: any;
}

export interface LoadingState {
    [key: string]: boolean;
}

export interface ErrorState {
    [key: string]: string | null;
}