import { GridColDef } from '@mui/x-data-grid';
import { DataFormattingOptions, DataGridStructure } from '@/types/mapping';

export const processDataForGrid = (
    data: any,
    dataFormattingOptions: DataFormattingOptions
): DataGridStructure => {
    try {
        if (!data || !data.FormStructure || !data.FormMetadata) {
            throw new Error('Invalid data structure');
        }

        // Extract metadata fields
        const metadataFields = Object.entries(data.FormMetadata);

        // Find CHA (characteristic) fields - these become row headers
        const chaFields = metadataFields
            .filter(([_, metadata]: [string, any]) => metadata.type === 'CHA')
            .map(([key, metadata]: [string, any]) => ({
                id: key,
                field: key,
                headerName: metadata.label || key,
                width: 150,
                type: 'string',
            }));

        // Find KF (key figure) fields - these become columns
        const kfFields = metadataFields
            .filter(([_, metadata]: [string, any]) => metadata.type === 'KF')
            .map(([key, metadata]: [string, any]) => ({
                id: key,
                field: key,
                headerName: metadata.label || key,
                width: 120,
                type: 'number',
                valueFormatter: (params: any) => {
                    if (params.value === null || params.value === undefined) return 'N/A';

                    let value = Number(params.value);

                    if (dataFormattingOptions.currency) {
                        return `$${value.toLocaleString(undefined, {
                            minimumFractionDigits: dataFormattingOptions.decimals,
                            maximumFractionDigits: dataFormattingOptions.decimals,
                        })}`;
                    }

                    if (dataFormattingOptions.percentage) {
                        return `${value.toFixed(dataFormattingOptions.decimals)}%`;
                    }

                    if (dataFormattingOptions.thousands) {
                        return value.toLocaleString(undefined, {
                            minimumFractionDigits: dataFormattingOptions.decimals,
                            maximumFractionDigits: dataFormattingOptions.decimals,
                        });
                    }

                    return value.toFixed(dataFormattingOptions.decimals);
                },
            }));

        // Create columns for DataGrid
        const columns = [...chaFields, ...kfFields];

        // Flatten the nested structure for rows
        const rows: any[] = [];
        const structureKeys = Object.keys(data.FormStructure);

        if (structureKeys.length === 0) {
            return {
                columns: [],
                rows: [],
                rowHeaders: chaFields,
                keyFigures: kfFields,
            };
        }

        const structureRoot = data.FormStructure[structureKeys[0]];

        // Recursively traverse the structure to extract rows
        const traverseStructure = (
            obj: any,
            path: string[] = [],
            chaValues: any[] = [],
            id = '',
        ) => {
            // Check if this is a leaf node with KF values
            const hasKfFields = Object.keys(obj).some((key) =>
                kfFields.some((field) => field.id === key),
            );

            if (hasKfFields) {
                // Create a row with both CHA and KF values
                const rowData: any = { id: id || `row-${rows.length}`, path };

                // Add CHA values
                chaFields.forEach((chaField, index) => {
                    rowData[chaField.id] = chaValues[index] || '';
                });

                // Add KF values
                kfFields.forEach((kfField) => {
                    rowData[kfField.id] =
                        obj[kfField.id] !== undefined ? obj[kfField.id] : null;
                });

                // Store the raw KF values separately
                rowData.kfValues = {};
                kfFields.forEach((kfField) => {
                    rowData.kfValues[kfField.id] = obj[kfField.id];
                });

                // Store the CHA values as an array
                rowData.chaValues = [...chaValues];

                rows.push(rowData);
            } else {
                // This is an intermediate node, continue traversing
                Object.entries(obj).forEach(([key, value], index) => {
                    if (typeof value === 'object' && value !== null) {
                        traverseStructure(
                            value,
                            [...path, key],
                            [...chaValues, key],
                            `row-${rows.length}-${index}`,
                        );
                    }
                });
            }
        };

        // Start traversal from the root
        traverseStructure(structureRoot, [structureKeys[0]], []);

        return {
            columns,
            rows,
            rowHeaders: chaFields,
            keyFigures: kfFields,
        };
    } catch (error) {
        return { columns: [], rows: [], rowHeaders: [], keyFigures: [] };
    }
};