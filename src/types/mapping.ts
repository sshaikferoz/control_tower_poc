import React from 'react';
import { Layout } from 'react-grid-layout';

export interface Widget {
    id: string;
    name: string;
    props: Record<string, any>;
}

export interface FieldMappings {
    [key: string]: WidgetMappingConfig;
}

export interface LayoutItem extends Layout {
    static: boolean;
    sectionName?: string;
}

export interface ApiEndpoint {
    id: string;
    name: string;
    url: string;
}

export interface HybridDataNode {
    id: string;
    type: 'CHA' | 'KF';
    fieldName: string;
    label: string;
    isCustom: boolean;
    parentId?: string;
    children?: HybridDataNode[];
}

export interface HybridDataRecord {
    id: string;
    isCustom: boolean;
    isEditable: boolean;
    data: Record<string, any>;
    metadata?: {
        createdAt: string;
        modifiedAt?: string;
        source: 'db' | 'custom';
    };
}

export interface HybridDataset {
    id: string;
    name: string;
    description: string;
    schema: {
        chaFields: HybridDataNode[];
        kfFields: HybridDataNode[];
    };
    records: HybridDataRecord[];
    customFieldsCount: number;
    dbFieldsCount: number;
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface DataFormattingOptions {
    currency: boolean;
    percentage: boolean;
    thousands: boolean;
    decimals: number;
}

export interface DataGridStructure {
    columns: any[];
    rows: any[];
    rowHeaders: any[];
    keyFigures: any[];
}

export interface HybridFilterOptions {
    showDbRecords: boolean;
    showCustomRecords: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}