import { useState, useCallback } from 'react';
import { Widget, FieldMappings } from '@/types/mapping';
import { widgetConfigFields } from '@/helpers/types';
import { defaultPropsMapping } from '@/constants/mapping';
import { getWidgetMappingType, getWidgetCategory } from '@/utils/widgetUtils';
import { getValueByPath } from '@/helpers/transformHelpers';

export const useWidgetConfiguration = () => {
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [fieldMappings, setFieldMappings] = useState<FieldMappings>({});
    const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
    const [widgetConfigurations, setWidgetConfigurations] = useState<Record<string, any>>({});
    const [previewData, setPreviewData] = useState<any>(null);

    // Chart configuration states
    const [chartXAxis, setChartXAxis] = useState<string>('');
    const [chartYAxis, setChartYAxis] = useState<string>('');
    const [chartYAxis2, setChartYAxis2] = useState<string>('');
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [tableColumns, setTableColumns] = useState<Array<{ field: string; header: string }>>([]);
    const [stackedSeries, setStackedSeries] = useState<Array<{ name: string; dataKey: string; color: string }>>([]);

    const initializeWidgetMappingConfig = useCallback((widgetId: string, widgetName: string, reportName: string) => {
        const mappingType = getWidgetMappingType(widgetName);
        const widgetCategory = getWidgetCategory(widgetName);

        const fields: Record<string, any> = {};
        const configFields = widgetConfigFields[widgetName as keyof typeof widgetConfigFields] || [];

        configFields.forEach(({ field, path }) => {
            fields[field] = {
                fieldPath: path,
                inputType: 'manual',
                manualValue: getValueByPath(defaultPropsMapping[widgetName], path),
            };
        });

        const baseConfig = {
            reportName: reportName,
            mappingType: mappingType,
            fields: fields,
        };

        let configToSave;

        if (mappingType === 'chart') {
            if (widgetCategory === 'dual-line') {
                configToSave = {
                    ...baseConfig,
                    chartConfig: {
                        xAxis: { field: '', type: 'CHA' },
                        yAxis: [
                            { field: '', type: 'KF' },
                            { field: '', type: 'KF' },
                        ],
                    },
                };
            } else if (widgetCategory === 'stacked-bar') {
                const defaultSeries = defaultPropsMapping[widgetName]?.series || [];
                configToSave = {
                    ...baseConfig,
                    chartConfig: {
                        xAxis: { field: '', type: 'CHA' },
                        yAxis: { fields: [], type: 'KF' },
                    },
                    seriesConfig: {
                        series: [...defaultSeries],
                    },
                };
            } else {
                configToSave = {
                    ...baseConfig,
                    chartConfig: {
                        xAxis: { field: '', type: 'CHA' },
                        yAxis: { field: '', type: 'KF' },
                    },
                };
            }
        } else if (mappingType === 'table') {
            configToSave = {
                ...baseConfig,
                tableConfig: {
                    columns: [],
                },
            };
        } else if (mappingType === 'quadrant') {
            configToSave = {
                ...baseConfig,
                quadrantConfig: {
                    chaField: '',
                    metrics: [],
                },
            };
        } else {
            configToSave = baseConfig;
        }

        setFieldMappings((prev) => ({
            ...prev,
            [widgetId]: configToSave,
        }));

        setWidgetConfigurations((prev) => ({
            ...prev,
            [widgetId]: {
                ...defaultPropsMapping[widgetName],
                widgetType: widgetName,
                configType: mappingType,
                widgetCategory: widgetCategory,
                roles: [],
            },
        }));
    }, []);

    const handleWidgetClick = useCallback((id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (selectedWidget === id) return;

        // Save preview data to widget configurations if it exists
        if (selectedWidget && previewData) {
            setWidgetConfigurations((prev) => ({
                ...prev,
                [selectedWidget]: {
                    ...prev[selectedWidget],
                    ...previewData,
                },
            }));
        }

        setSelectedWidget(id);
        setPreviewData(null);

        // Load existing configuration for this widget
        const widget = widgets.find((w) => w.id === id);
        if (!widget) return;

        const config = fieldMappings[id];
        const widgetCategory = getWidgetCategory(widget.name);

        if (config?.mappingType === 'chart' && config.chartConfig) {
            setChartXAxis(config.chartConfig.xAxis.field);

            if (widgetCategory === 'dual-line' && Array.isArray(config.chartConfig.yAxis)) {
                setChartYAxis(config.chartConfig.yAxis[0]?.field || '');
                setChartYAxis2(config.chartConfig.yAxis[1]?.field || '');
            } else if (widgetCategory === 'stacked-bar' && config.chartConfig.yAxis.fields) {
                setChartYAxis('');
                if (config.seriesConfig && config.seriesConfig.series) {
                    setStackedSeries([...config.seriesConfig.series]);
                } else {
                    setStackedSeries([]);
                }
            } else {
                setChartYAxis(config.chartConfig.yAxis?.field || '');
                setChartYAxis2('');
            }
        } else if (config?.mappingType === 'table' && config.tableConfig) {
            setTableColumns(config.tableConfig.columns || []);
        } else if (config?.mappingType === 'quadrant' && config?.quadrantConfig) {
            setSelectedMetrics(config.quadrantConfig.metrics || []);
        }
    }, [selectedWidget, previewData, widgets, fieldMappings]);

    return {
        widgets,
        setWidgets,
        fieldMappings,
        setFieldMappings,
        selectedWidget,
        setSelectedWidget,
        widgetConfigurations,
        setWidgetConfigurations,
        previewData,
        setPreviewData,
        chartXAxis,
        setChartXAxis,
        chartYAxis,
        setChartYAxis,
        chartYAxis2,
        setChartYAxis2,
        selectedMetrics,
        setSelectedMetrics,
        tableColumns,
        setTableColumns,
        stackedSeries,
        setStackedSeries,
        initializeWidgetMappingConfig,
        handleWidgetClick,
    };
};
