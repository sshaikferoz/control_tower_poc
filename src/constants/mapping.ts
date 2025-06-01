import MultiMetrics from '@/components/Widgets/MultiMetrics';
import PieMetric from '@/components/Widgets/PieMetric';
import SimpleMetric from '@/components/Widgets/SimpleMetric';
import SimpleMetricDate from '@/components/Widgets/SimpleMetricDate';
import SingleLineChart from '@/components/Widgets/SingleLineChart';
import TableMetric from '@/components/Widgets/TableMetric';
import BarMetric from '@/components/Widgets/BarMetric';
import StackedBarChart from '@/components/Widgets/StackedBarChart';
import OrdersLineChart from '@/components/Widgets/OrdersLineChart';
import DualLineChart from '@/components/Widgets/DualLineChart';
import PieChartWithTotal from '@/components/Widgets/PieChartWithTotal';
import QuadrantMetrics from '@/components/Widgets/QuadrantMetrics';
import LoansAppTray from '@/components/Widgets/LoansAppTray';

// Component mapping
export const widgetMapping: Record<string, React.ComponentType<any>> = {
    'two-metrics': MultiMetrics,
    'two-metrics-piechart': PieMetric,
    'one-metric': SimpleMetric,
    'one-metric-date': SimpleMetricDate,
    'two-metrics-linechart': SingleLineChart,
    'one-metric-table': TableMetric,
    'bar-chart': BarMetric,
    'stacked-bar-chart': StackedBarChart,
    'orders-line-chart': OrdersLineChart,
    'dual-line-chart': DualLineChart,
    'pie-chart-total': PieChartWithTotal,
    'quadrant-metrics': QuadrantMetrics,
    'loans-app-tray': LoansAppTray,
};

// Widget size configurations
export const widgetSizes: Record<string, { w: number; h: number }> = {
    'one-metric': { w: 2, h: 1.5 },
    'one-metric-date': { w: 2, h: 1.5 },
    'two-metrics-linechart': { w: 4, h: 3 },
    'two-metrics': { w: 2.5, h: 1.5 },
    'two-metrics-piechart': { w: 2.5, h: 1.5 },
    'one-metric-table': { w: 4, h: 3 },
    'bar-chart': { w: 2.5, h: 3 },
    'stacked-bar-chart': { w: 6, h: 3 },
    'orders-line-chart': { w: 4, h: 3 },
    'dual-line-chart': { w: 4, h: 3 },
    'pie-chart-total': { w: 2.5, h: 3 },
    'quadrant-metrics': { w: 4, h: 3 },
    'loans-app-tray': { w: 6, h: 3 },
};

// Default widget props for preview
export const defaultPropsMapping: Record<string, any> = {
    'one-metric': { name: 'Active Contracts', value: 45 },
    'one-metric-date': {
        name: 'Open PO Orders',
        value: 18,
        date: '13-Aug-2024',
    },
    'two-metrics': {
        metric1: 'Long Form',
        value1: '12.3',
        metric2: 'Short & Mid-Form',
        value2: '135',
    },
    'two-metrics-linechart': {
        data: {
            chart_data: [
                { date: '01-01-2024', Actual: 50, unit: '%' },
                { date: '01-02-2024', Actual: 100, unit: '%' },
                { date: '01-03-2024', Actual: 90, unit: '%' },
                { date: '01-04-2024', Actual: 150, unit: '%' },
                { date: '01-05-2024', Actual: 120, unit: '%' },
                { date: '01-06-2024', Actual: 195, unit: '%' },
            ],
            chart_yaxis: 'Actual',
            metric_data: {
                metric_value: '$142',
                metric_variance: '+5.40%',
                metric_label: 'Received Payments',
            },
            widget_name: 'Successful Payments',
        },
    },
    'two-metrics-piechart': {
        data: [
            { label: 'Flaring Intensity', value: 30, fill: '#84BD00' },
            { label: 'SO2 Emissions', value: 70, fill: '#E1553F' },
        ],
        metrics: {
            amount: '$234K',
            percentage: '0.31%',
            label: 'Contracts Under Development',
        },
    },
    'one-metric-table': {
        totalAmount: '$15,223,050',
        data: [
            { supplier_name: 'Reliable Suppliers', contracts: 7, value: '$52,345' },
            { supplier_name: 'Supply Solutions', contracts: 5, value: '$42,345' },
        ],
    },
    'bar-chart': {
        data: [
            {
                name: '2024',
                value: 163000,
                fill: '#83bd01',
            },
            {
                name: '2025',
                value: 118000,
                fill: '#FFC846',
            },
        ],
        title: 'Spend Comparison',
        variance: '+5.40%',
    },
    'stacked-bar-chart': {
        data: [
            { name: 'Jan', Supplier1: 400, Supplier2: 240, Supplier3: 100 },
            { name: 'Feb', Supplier1: 300, Supplier2: 200, Supplier3: 150 },
            { name: 'Mar', Supplier1: 450, Supplier2: 220, Supplier3: 180 },
            { name: 'Apr', Supplier1: 470, Supplier2: 260, Supplier3: 120 },
            { name: 'May', Supplier1: 390, Supplier2: 210, Supplier3: 160 },
            { name: 'Jun', Supplier1: 520, Supplier2: 280, Supplier3: 220 },
        ],
        title: 'Top Spend Supplier',
        series: [
            { name: 'Supplier A', dataKey: 'Supplier1', color: '#84BD00' },
            { name: 'Supplier B', dataKey: 'Supplier2', color: '#FFC846' },
            { name: 'Supplier C', dataKey: 'Supplier3', color: '#8979FF' },
        ],
    },
    'orders-line-chart': {
        data: [
            { name: 'Jan', value: 120000 },
            { name: 'Feb', value: 150000 },
            { name: 'Mar', value: 180000 },
            { name: 'Apr', value: 140000 },
            { name: 'May', value: 160000 },
            { name: 'Jun', value: 190000 },
            { name: 'Jul', value: 175000 },
            { name: 'Aug', value: 195000 },
            { name: 'Sep', value: 165000 },
            { name: 'Oct', value: 185000 },
            { name: 'Nov', value: 205000 },
            { name: 'Dec', value: 220000 },
        ],
        title: 'Last 12 Months Orders',
        totalValue: '$235MM',
    },
    'dual-line-chart': {
        data: [
            { name: 'Jan', line1: 10000, line2: 15000 },
            { name: 'Feb', line1: 12000, line2: 18000 },
            { name: 'Mar', line1: 15000, line2: 14000 },
            { name: 'Apr', line1: 13000, line2: 19000 },
            { name: 'May', line1: 17000, line2: 16000 },
            { name: 'Jun', line1: 20000, line2: 21000 },
        ],
        title: 'Spend Trends',
        series: [
            { name: 'Contract Spend', dataKey: 'line1', color: '#5899DA' },
            { name: 'Material Spend', dataKey: 'line2', color: '#FFC846' },
        ],
    },
    'pie-chart-total': {
        data: [
            { name: 'Segment 1', value: 2000, fill: '#84BD00' },
            { name: 'Segment 2', value: 1128, fill: '#E1553F' },
        ],
        title: 'With P&SCM Buyers',
        totalValue: '$3,128B',
        subValue: '$339.1B',
        variance: '+23.98%',
    },
    'quadrant-metrics': {
        topLeftTitle: 'In Process Requestions',
        topLeftValue: '53',
        topRightTitle: 'With Supplier',
        topRightValue: '18',
        bottomLeftTitle: 'B2B Order',
        bottomLeftValue: '1,335',
        bottomRightTitle: 'Completed Order',
        bottomRightValue: '1,247',
    },
    'loans-app-tray': {
        menuItems: [
            {
                id: 1,
                icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/vector.svg`,
                label: 'Open PR',
                count: 13,
            },
            {
                id: 2,
                icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/group-1000003443.png`,
                label: 'Contract Expiring',
                count: 85,
            },
            {
                id: 3,
                icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/group-1000003444.png`,
                label: 'Pending SES',
                count: 32,
            },
            {
                id: 4,
                icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/vector-1.svg`,
                label: 'Contract with 80%\nConsumed Values',
                count: 24,
            },
        ],
        chartData: [
            { name: 'PR', value: 86, color: '#449ca4' },
            { name: 'CE', value: 156, color: '#5899da' },
            { name: 'SES', value: 114, color: '#ffaa04' },
            { name: 'CV', value: 126, color: '#ff0000' },
        ],
    },
};
