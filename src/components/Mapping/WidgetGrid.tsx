'use client';
import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { Widget, LayoutItem } from '@/types/mapping';
import { widgetMapping, defaultPropsMapping } from '@/constants/mapping';

const GridLayout = WidthProvider(RGL);

interface WidgetGridProps {
  widgets: Widget[];
  layout: LayoutItem[];
  sectionName: string;
  selectedWidget: string | null;
  widgetConfigurations: Record<string, any>;
  previewData: any;
  onLayoutChange: (newLayout: LayoutItem[]) => void;
  onWidgetClick: (id: string, event: React.MouseEvent) => void;
  onRemoveWidget: (id: string) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  layout,
  sectionName,
  selectedWidget,
  widgetConfigurations,
  previewData,
  onLayoutChange,
  onWidgetClick,
  onRemoveWidget,
}) => {
  return (
    <div className="max-xl flex flex-1 flex-col p-4">
      <Typography variant="h5" component="h1" gutterBottom>
        {sectionName}
      </Typography>

      <GridLayout
        className="layout h-52 w-full"
        layout={layout}
        cols={12}
        rowHeight={80}
        width={80}
        isResizable={false}
        isDraggable={true}
        onLayoutChange={onLayoutChange}
      >
        {widgets.map(({ id, name }) => {
          const Component = widgetMapping[name];
          const widgetProps =
            previewData && selectedWidget === id
              ? previewData
              : widgetConfigurations[id] || defaultPropsMapping[name];

          const hasRoles = widgetConfigurations[id]?.roles?.length > 0;

          return (
            <div
              key={id}
              className={`relative z-100 rounded-lg bg-white shadow-md ${
                selectedWidget === id ? 'border-2 border-blue-500' : ''
              } ${hasRoles ? 'border border-green-500' : ''}`}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onWidgetClick(id, e);
              }}
            >
              <button
                className="absolute top-2 right-2 z-50 rounded bg-red-500 px-2 py-1 text-xs text-white"
                style={{ pointerEvents: 'auto' }}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveWidget(id);
                }}
              >
                ✕
              </button>
              {hasRoles && (
                <div className="absolute top-2 left-2 z-50 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                  <SecurityIcon style={{ fontSize: 14 }} />
                </div>
              )}
              <Component {...widgetProps} />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};
