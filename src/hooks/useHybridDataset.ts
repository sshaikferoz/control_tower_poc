import { useState, useCallback } from 'react';
import { HybridDataset, HybridDataNode, HybridDataRecord, HybridFilterOptions } from '@/types/mapping';

export const useHybridDataset = () => {
    const [hybridDatasets, setHybridDatasets] = useState<HybridDataset[]>([]);
    const [activeHybridDataset, setActiveHybridDataset] = useState<HybridDataset | null>(null);
    const [isHybridDesignerOpen, setIsHybridDesignerOpen] = useState<boolean>(false);
    const [draggedNode, setDraggedNode] = useState<HybridDataNode | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<HybridDataRecord | null>(null);
    const [isAddingCustomRecord, setIsAddingCustomRecord] = useState<boolean>(false);
    const [customRecordData, setCustomRecordData] = useState<Record<string, any>>({});
    const [hybridFilterOptions, setHybridFilterOptions] = useState<HybridFilterOptions>({
        showDbRecords: true,
        showCustomRecords: true,
        sortBy: 'createdAt',
        sortOrder: 'asc',
    });

    const createHybridDatasetFromResponse = useCallback((apiResponse: any, reportName: string): HybridDataset => {
        const chaFields: HybridDataNode[] = apiResponse.header
            .filter((field: any) => field.type === 'CHA')
            .map((field: any) => ({
                id: `cha-${field.fieldName}`,
                type: 'CHA' as const,
                fieldName: field.fieldName,
                label: field.label,
                isCustom: false,
            }));

        const kfFields: HybridDataNode[] = apiResponse.header
            .filter((field: any) => field.type === 'KF')
            .map((field: any) => ({
                id: `kf-${field.fieldName}`,
                type: 'KF' as const,
                fieldName: field.fieldName,
                label: field.label,
                isCustom: false,
            }));

        const records: HybridDataRecord[] = apiResponse.chartData.map(
            (item: any, index: number) => ({
                id: `db-record-${index}`,
                isCustom: false,
                isEditable: false,
                data: item,
                metadata: {
                    createdAt: new Date().toISOString(),
                    source: 'db' as const,
                },
            }),
        );

        return {
            id: `dataset-${Date.now()}`,
            name: `Dataset from ${reportName}`,
            description: `Auto-generated dataset from SAP BW report ${reportName}`,
            schema: {
                chaFields,
                kfFields,
            },
            records,
            customFieldsCount: 0,
            dbFieldsCount: records.length,
        };
    }, []);

    const addCustomField = useCallback((fieldType: 'CHA' | 'KF', label: string) => {
        if (!activeHybridDataset) return;

        const fieldName = `CUSTOM_${fieldType}_${Date.now()}`;
        const newField: HybridDataNode = {
            id: `${fieldType.toLowerCase()}-${fieldName}`,
            type: fieldType,
            fieldName,
            label,
            isCustom: true,
        };

        const updatedDataset = {
            ...activeHybridDataset,
            schema: {
                ...activeHybridDataset.schema,
                [fieldType === 'CHA' ? 'chaFields' : 'kfFields']: [
                    ...activeHybridDataset.schema[fieldType === 'CHA' ? 'chaFields' : 'kfFields'],
                    newField,
                ],
            },
        };

        setActiveHybridDataset(updatedDataset);
        updateHybridDataset(updatedDataset);
    }, [activeHybridDataset]);

    const addCustomRecord = useCallback(() => {
        if (!activeHybridDataset) return;

        const allFields = [
            ...activeHybridDataset.schema.chaFields,
            ...activeHybridDataset.schema.kfFields,
        ];
        const recordData: Record<string, any> = {};

        allFields.forEach((field) => {
            if (field.type === 'CHA') {
                recordData[field.fieldName] = customRecordData[field.fieldName] || '';
            } else {
                recordData[field.fieldName] = customRecordData[field.fieldName] || 0;
            }
        });

        const newRecord: HybridDataRecord = {
            id: `custom-record-${Date.now()}`,
            isCustom: true,
            isEditable: true,
            data: recordData,
            metadata: {
                createdAt: new Date().toISOString(),
                source: 'custom',
            },
        };

        const updatedDataset = {
            ...activeHybridDataset,
            records: [...activeHybridDataset.records, newRecord],
            customFieldsCount: activeHybridDataset.customFieldsCount + 1,
        };

        setActiveHybridDataset(updatedDataset);
        updateHybridDataset(updatedDataset);
        setCustomRecordData({});
        setIsAddingCustomRecord(false);
    }, [activeHybridDataset, customRecordData]);

    const updateCustomRecord = useCallback((recordId: string, data: Record<string, any>) => {
        if (!activeHybridDataset) return;

        const updatedRecords = activeHybridDataset.records.map((record) =>
            record.id === recordId
                ? {
                    ...record,
                    data: { ...record.data, ...data },
                    metadata: {
                        ...record.metadata,
                        modifiedAt: new Date().toISOString(),
                    },
                }
                : record,
        );

        const updatedDataset = {
            ...activeHybridDataset,
            records: updatedRecords,
        };

        setActiveHybridDataset(updatedDataset);
        updateHybridDataset(updatedDataset);
    }, [activeHybridDataset]);

    const deleteCustomRecord = useCallback((recordId: string) => {
        if (!activeHybridDataset) return;

        const recordToDelete = activeHybridDataset.records.find((r) => r.id === recordId);
        if (!recordToDelete || !recordToDelete.isCustom) return;

        const updatedRecords = activeHybridDataset.records.filter((r) => r.id !== recordId);

        const updatedDataset = {
            ...activeHybridDataset,
            records: updatedRecords,
            customFieldsCount: activeHybridDataset.customFieldsCount - 1,
        };

        setActiveHybridDataset(updatedDataset);
        updateHybridDataset(updatedDataset);
    }, [activeHybridDataset]);

    const updateHybridDataset = useCallback((dataset: HybridDataset) => {
        setHybridDatasets((prev) => prev.map((ds) => (ds.id === dataset.id ? dataset : ds)));
    }, []);

    const generateHybridDatasetJSON = useCallback((): any => {
        if (!activeHybridDataset) return null;

        const filteredRecords = activeHybridDataset.records.filter((record) => {
            if (!hybridFilterOptions.showDbRecords && !record.isCustom) return false;
            if (!hybridFilterOptions.showCustomRecords && record.isCustom) return false;
            return true;
        });

        const sortedRecords = [...filteredRecords].sort((a, b) => {
            const aValue = a.metadata?.[hybridFilterOptions.sortBy as keyof typeof a.metadata] || '';
            const bValue = b.metadata?.[hybridFilterOptions.sortBy as keyof typeof b.metadata] || '';
            const comparison = aValue.localeCompare(bValue);
            return hybridFilterOptions.sortOrder === 'asc' ? comparison : -comparison;
        });

        return {
            header: [
                ...activeHybridDataset.schema.chaFields.map((field) => ({
                    type: field.type,
                    fieldName: field.fieldName,
                    label: field.label,
                    isCustom: field.isCustom,
                })),
                ...activeHybridDataset.schema.kfFields.map((field) => ({
                    type: field.type,
                    fieldName: field.fieldName,
                    label: field.label,
                    isCustom: field.isCustom,
                })),
            ],
            chartData: sortedRecords.map((record) => ({
                ...record.data,
                _metadata: record.metadata,
            })),
            summary: {
                totalRecords: sortedRecords.length,
                dbRecords: sortedRecords.filter((r) => !r.isCustom).length,
                customRecords: sortedRecords.filter((r) => r.isCustom).length,
                lastModified: Math.max(
                    ...sortedRecords.map((r) =>
                        new Date(r.metadata?.modifiedAt || r.metadata?.createdAt || 0).getTime(),
                    ),
                ),
            },
        };
    }, [activeHybridDataset, hybridFilterOptions]);

    return {
        hybridDatasets,
        setHybridDatasets,
        activeHybridDataset,
        setActiveHybridDataset,
        isHybridDesignerOpen,
        setIsHybridDesignerOpen,
        draggedNode,
        setDraggedNode,
        selectedRecord,
        setSelectedRecord,
        isAddingCustomRecord,
        setIsAddingCustomRecord,
        customRecordData,
        setCustomRecordData,
        hybridFilterOptions,
        setHybridFilterOptions,
        createHybridDatasetFromResponse,
        addCustomField,
        addCustomRecord,
        updateCustomRecord,
        deleteCustomRecord,
        updateHybridDataset,
        generateHybridDatasetJSON,
    };
};