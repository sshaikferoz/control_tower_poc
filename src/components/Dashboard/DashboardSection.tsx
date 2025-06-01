'use client';
import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RGL, { WidthProvider } from 'react-grid-layout';
import MyContractsIcon from '@/assets/MyContractsIcon';
import { parseXMLToJson } from '@/lib/mirage/xmltoJson';
import { transformFormMetadata } from '@/helpers/transformHelpers';
import { TransformedData } from '@/helpers/types';
import {
  SectionProps,
  WidgetProps,
  LoadingState,
  ErrorState,
} from '@/types/dashboard';
import { widgetMapping, defaultPropsMapping } from '@/constants/dashboard';
import { debugWidgetProps, processWidgetData } from '@/utils/widgetProcessing';

const GridLayout = WidthProvider(RGL);

export const DashboardSection: React.FC<SectionProps> = ({
  section,
  index,
  isEditMode,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver,
}) => {
  const [reportData, setReportData] = useState<
    Record<string, TransformedData | null>
  >({});
  const [widgetProps, setWidgetProps] = useState<WidgetProps>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<ErrorState>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    return section.expanded !== undefined
      ? section.expanded.toLowerCase() === 'true'
      : true;
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize widgetProps with saved props or default values
    const initialWidgetProps: WidgetProps = {};

    section.widgets?.forEach((widget: any) => {
      // PRIORITY: Use saved props from widget if available
      if (widget.props && Object.keys(widget.props).length > 0) {
        // Remove config-specific properties that shouldn't be passed to components
        const { configType, widgetCategory, ...cleanProps } = widget.props;
        initialWidgetProps[widget.id] = cleanProps;
      } else {
        // Fallback to default props if no saved props
        initialWidgetProps[widget.id] = defaultPropsMapping[widget.name] || {};
      }
    });

    // Set the initial props immediately
    setWidgetProps(initialWidgetProps);

    // Only attempt to fetch and reprocess data if widgets don't have saved props
    const shouldRefetchData = section.widgets?.some((widget: any) => {
      const mapping = section.fieldMappings?.[widget.id];
      return (
        mapping && (!widget.props || Object.keys(widget.props).length === 0)
      );
    });

    if (!shouldRefetchData) {
      return;
    }

    // Collect unique report names only for widgets that need reprocessing
    const uniqueReports = new Set<string>();
    Object.values(section.fieldMappings || {}).forEach((mapping: any) => {
      if (mapping.reportName) {
        uniqueReports.add(mapping.reportName);
      }
    });

    // Fetch data for each unique report (only if needed)
    [...uniqueReports].forEach(async (reportName) => {
      setLoading((prev) => ({ ...prev, [reportName]: true }));

      try {
        const response = await fetch(
          `/api/sap/bc/bsp/sap/zbw_reporting/execute_report_oo.htm?query=${reportName}`,
        );
        const data = await response.text();
        const parsedJSON = parseXMLToJson(data);

        // Transform raw data into structured format
        const transformedData = transformFormMetadata(parsedJSON);

        // Store the transformed data
        setReportData((prev) => ({ ...prev, [reportName]: transformedData }));

        // Process widget props only for widgets that don't have saved props
        const updatedProps = { ...initialWidgetProps };

        section.widgets?.forEach((widget: any) => {
          const widgetMappingConfig = section.fieldMappings?.[widget.id];

          // Only reprocess if no saved props and has mapping config
          if (
            widgetMappingConfig &&
            widgetMappingConfig.reportName === reportName &&
            (!widget.props || Object.keys(widget.props).length === 0)
          ) {
            try {
              const processedProps = processWidgetData(
                widget,
                widgetMappingConfig,
                transformedData,
              );
              updatedProps[widget.id] = processedProps;
            } catch (err) {
              // Maintain saved props or default props if processing fails
              updatedProps[widget.id] =
                widget.props || defaultPropsMapping[widget.name] || {};
            }
          }
        });

        // Update widgets that were reprocessed
        setWidgetProps(updatedProps);
        setLoading((prev) => ({ ...prev, [reportName]: false }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          [reportName]: 'Failed to load report data',
        }));
        setLoading((prev) => ({ ...prev, [reportName]: false }));
      }
    });
  }, [section]);

  // Toggle expanded/collapsed state
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.style.opacity = '0.4';
      }
    }, 0);
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(index);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter(index);
  };

  const handleDragEnd = () => {
    if (sectionRef.current) {
      sectionRef.current.style.opacity = '1';
    }
    onDragEnd();
  };

  return (
    <div
      ref={sectionRef}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragEnd={handleDragEnd}
      className={`mb-8 ${
        isEditMode
          ? 'cursor-move rounded-lg border-2 border-dashed border-blue-300'
          : ''
      }`}
      data-index={index}
    >
      <div className="m-2 flex items-center gap-2 p-4">
        {isEditMode && (
          <div className="mr-2">
            <DragIndicatorIcon className="text-white" />
          </div>
        )}
        <MyContractsIcon />
        <p className="text-[#fff]">{section.sectionName}</p>
        <div className="h-px flex-grow bg-[#E8E9EE80]"></div>
        <span className="cursor-pointer text-white" onClick={toggleExpanded}>
          {isExpanded ? '▼' : '►'}
        </span>
      </div>

      {isExpanded && (
        <div className="px-6">
          {/* Show loading indicator if any reports are still loading */}
          {Object.values(loading).some((isLoading) => isLoading) && (
            <div className="mb-4 flex h-20 items-center justify-center">
              <CircularProgress size={24} />
              <Typography className="ml-2 text-white">
                Loading widget data...
              </Typography>
            </div>
          )}

          {/* Show error message if any reports failed to load */}
          {Object.entries(error).map(
            ([reportName, errorMsg]) =>
              errorMsg && (
                <div
                  key={reportName}
                  className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                >
                  <Typography>
                    Error loading data for report {reportName}: {errorMsg}
                  </Typography>
                </div>
              ),
          )}

          <GridLayout
            className="layout w-full"
            layout={section.layout}
            cols={12}
            rowHeight={80}
            isResizable={false}
            isDraggable={false}
          >
            {section.widgets?.map((widget: any) => {
              const Component = widgetMapping[widget.name];
              // Use widgetProps which now prioritizes saved props
              const props =
                widgetProps[widget.id] ||
                defaultPropsMapping[widget.name] ||
                {};

              // Debug logging to help troubleshoot
              debugWidgetProps(widget.id, widget.name, props);

              // Check if we have the component and valid props
              if (!Component) {
                console.error(
                  `Component not found for widget type: ${widget.name}`,
                );
                return (
                  <div
                    key={widget.id}
                    className="bg-opacity-30 relative flex items-center justify-center rounded-lg bg-red-500"
                  >
                    <div className="p-4 text-center text-white">
                      <p>Widget type not found: {widget.name}</p>
                      <p className="mt-2 text-xs">
                        Available types: {Object.keys(widgetMapping).join(', ')}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={widget.id}
                  className="relative rounded-lg bg-transparent shadow-md"
                >
                  <div className="h-full w-full">
                    <Component {...props} />
                  </div>
                </div>
              );
            })}
          </GridLayout>
        </div>
      )}
    </div>
  );
};
