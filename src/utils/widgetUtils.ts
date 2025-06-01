export const getWidgetMappingType = (
    widgetName: string,
): 'simple' | 'chart' | 'table' | 'quadrant' => {
    if (widgetName.includes('table')) {
        return 'table';
    } else if (widgetName === 'quadrant-metrics') {
        return 'quadrant';
    } else if (
        widgetName.includes('linechart') ||
        widgetName.includes('piechart') ||
        widgetName.includes('bar-chart') ||
        widgetName.includes('stacked-bar') ||
        widgetName.includes('line-chart') ||
        widgetName.includes('pie-chart')
    ) {
        return 'chart';
    } else {
        return 'simple';
    }
};

export const getWidgetCategory = (widgetName: string): string => {
    if (widgetName === 'bar-chart') {
        return 'bar';
    } else if (widgetName === 'stacked-bar-chart') {
        return 'stacked-bar';
    } else if (widgetName === 'orders-line-chart') {
        return 'single-line';
    } else if (widgetName === 'dual-line-chart') {
        return 'dual-line';
    } else if (widgetName === 'pie-chart-total') {
        return 'pie-total';
    } else if (widgetName === 'quadrant-metrics') {
        return 'quadrant';
    } else if (widgetName.includes('piechart')) {
        return 'pie';
    } else if (widgetName.includes('linechart')) {
        return 'line';
    } else if (widgetName.includes('table')) {
        return 'table';
    } else {
        return 'simple';
    }
};