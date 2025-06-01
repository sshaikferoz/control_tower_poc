import {
    generateChartData,
    setValueByPath,
    formatValue,
} from '@/helpers/transformHelpers';
import {
    TransformedData,
    WidgetMappingConfig,
} from '@/helpers/types';
import { defaultPropsMapping } from '@/constants/dashboard';

// Debug helper function to log widget props
export const debugWidgetProps = (widgetId: string, widgetName: string, props: any) => {

    // Check for common required props by widget type
    const requiredProps: Record<string, string[]> = {
        'dual-line-chart': ['data', 'series', 'title'],
        'orders-line-chart': ['data', 'title'],
        'quadrant-metrics': ['metrics'],
        'loans-app-tray': ['menuItems', 'chartData'],
        'pie-chart-total': ['data', 'title', 'totalValue'],
        'bar-chart': ['data', 'title'],
        'stacked-bar-chart': ['data', 'series', 'title'],
    };

    const required = requiredProps[widgetName] || [];
    const missing = required.filter((prop) => !props.hasOwnProperty(prop));

    if (missing.length > 0) {
        console.warn('Missing required props:', missing);
    } else {
        console.log('✅ All required props present');
    }

    console.groupEnd();
};

// Process a widget's data based on its mapping configuration
export const processWidgetData = (
    widget: any,
    mappingConfig: WidgetMappingConfig,
    data: TransformedData,
): any => {
    console.log(
        `Processing widget ${widget.id}, type: ${widget.name}, mapping type: ${mappingConfig.mappingType}`,
    );

    // Determine what kind of widget we're dealing with
    const mappingType = mappingConfig.mappingType;

    // Start with default props as a foundation
    let processedProps = JSON.parse(
        JSON.stringify(defaultPropsMapping[widget.name] || {}),
    );

    try {
        if (mappingType === 'simple') {
            // For simple metrics, process each field mapping
            Object.entries(mappingConfig.fields || {}).forEach(
                ([fieldName, fieldMapping]) => {
                    if (fieldMapping.inputType === 'manual') {
                        // Use manual value directly
                        processedProps = setValueByPath(
                            processedProps,
                            fieldMapping.fieldPath,
                            fieldMapping.manualValue,
                        );
                    } else if (
                        fieldMapping.inputType === 'mapped' &&
                        fieldMapping.mappedConfig
                    ) {
                        // Extract mapped value from data
                        const { chaField, chaValue, kfField } = fieldMapping.mappedConfig;

                        try {
                            const value = data.FormStructure[chaField][chaValue][kfField];
                            processedProps = setValueByPath(
                                processedProps,
                                fieldMapping.fieldPath,
                                value,
                            );
                        } catch (err) {
                            console.error(
                                `Error mapping field ${fieldName} for widget ${widget.id}:`,
                                err,
                            );
                        }
                    }
                },
            );
        } else if (mappingType === 'chart' && mappingConfig.chartConfig) {
            // For charts, process the chart data
            const { xAxis, yAxis } = mappingConfig.chartConfig;

            if (xAxis && xAxis.field) {
                // Handle different chart types
                if (widget.name === 'two-metrics-linechart' && yAxis && yAxis.field) {
                    // For line charts
                    const chartData = generateChartData(
                        data,
                        xAxis.field,
                        yAxis.field,
                        ['Overall Result'],
                    ).map((item) => ({
                        date: item.label,
                        [yAxis.field]: item.value,
                        unit: data.FormMetadata[yAxis.field]?.type || '%',
                    }));

                    // Get overall value for metrics
                    const overallValue =
                        data.FormStructure[xAxis.field]['Overall Result']?.[yAxis.field];

                    processedProps = {
                        data: {
                            chart_data: chartData,
                            chart_yaxis: yAxis.field,
                            metric_data: {
                                metric_value: formatValue(overallValue, 'currency'),
                                metric_variance: '+0.00%', // This could be calculated with more data
                                metric_label:
                                    data.FormMetadata[yAxis.field]?.label || yAxis.field,
                            },
                            widget_name: data.FormMetadata[yAxis.field]?.label || 'Chart',
                        },
                    };
                } else if (
                    widget.name === 'two-metrics-piechart' &&
                    yAxis &&
                    yAxis.field
                ) {
                    // For pie charts
                    const chartData = generateChartData(
                        data,
                        xAxis.field,
                        yAxis.field,
                        ['Overall Result'],
                    ).map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        fill: ['#84BD00', '#E1553F', '#2D7FF9', '#FFA500'][index % 4],
                    }));

                    // Get total value from "Overall Result"
                    const totalValue =
                        data.FormStructure[xAxis.field]['Overall Result']?.[yAxis.field];

                    processedProps = {
                        data: chartData,
                        metrics: {
                            amount: formatValue(totalValue, 'currency'),
                            percentage: '100%',
                            label: data.FormMetadata[yAxis.field]?.label || yAxis.field,
                        },
                    };
                } else if (widget.name === 'bar-chart' && yAxis && yAxis.field) {
                    // For bar charts
                    const chartData = Object.entries(
                        data.FormStructure[xAxis.field] || {},
                    )
                        .filter(([chaValue]) => chaValue !== 'Overall Result')
                        .map(([chaValue, values]: [string, any], index) => {
                            const value = values[yAxis.field]
                                ? Number(values[yAxis.field])
                                : 0;
                            const colors = [
                                '#83bd01',
                                '#FFC846',
                                '#E1553F',
                                '#5899DA',
                                '#8979FF',
                            ];

                            return {
                                name: chaValue,
                                value: value,
                                fill: colors[index % colors.length],
                            };
                        });

                    const title = data.FormMetadata[yAxis.field]?.label || 'Chart';

                    processedProps = {
                        data: chartData,
                        title: title,
                        variance: '+0.00%',
                    };
                }
                // Add other chart type processing here...
            }
        } else if (mappingType === 'quadrant' && mappingConfig.quadrantConfig) {
            // For quadrant metrics
            const { chaField, metrics } = mappingConfig.quadrantConfig;

            if (chaField && metrics && metrics.length > 0) {
                // Define positions
                const positions = [
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                ];

                // Create metrics array with configured values
                const quadrantMetrics = metrics.map(
                    (metricName: any, index: number) => {
                        // Find the value for this metric
                        let value = '0';

                        if (metricName) {
                            // For simplicity, just grab the first KF field's value for the given metric CHA value
                            const kfFields = Object.keys(
                                data.FormStructure[chaField][metrics[0] || ''] || {},
                            );
                            if (kfFields.length > 0) {
                                const kfField = kfFields[0];
                                const metricValue =
                                    data.FormStructure[chaField][metricName]?.[kfField];
                                if (metricValue !== undefined) {
                                    value = String(metricValue);
                                }
                            }
                        }

                        return {
                            title: metricName || 'No Data',
                            value: value,
                            position: positions[index] as
                                | 'top-left'
                                | 'top-right'
                                | 'bottom-left'
                                | 'bottom-right',
                        };
                    },
                );

                // Fill in any missing metrics to ensure we have 4
                while (quadrantMetrics.length < 4) {
                    quadrantMetrics.push({
                        title: 'No Data',
                        value: '0',
                        position: positions[quadrantMetrics.length] as
                            | 'top-left'
                            | 'top-right'
                            | 'bottom-left'
                            | 'bottom-right',
                    });
                }

                processedProps = { metrics: quadrantMetrics };
            }
        }
        // Add other mapping types (table, loans-app-tray, etc.) here...
    } catch (error) {
        console.error(`Error processing widget data for ${widget.id}:`, error);
        // Keep the default props if an error occurs
    }

    console.log(`Processed props for widget ${widget.id}:`, processedProps);
    return processedProps;
};