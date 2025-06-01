'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  FormControl,
  TextField,
  CircularProgress,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DataIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PreviewIcon from '@mui/icons-material/Visibility';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';

import SidebarMapping from '@/components/SidebarMapping';
import { TabPanel } from './TabPanel';
import { WidgetGrid } from './WidgetGrid';
import { BasicMappingTab } from './Tabs/BasicMappingTab';
import { useMappingData } from '@/hooks/useMappingData';
import { useWidgetConfiguration } from '@/hooks/useWidgetConfiguration';
import { useHybridDataset } from '@/hooks/useHybridDataset';
import { widgetSizes } from '@/constants/mapping';
import { getWidgetMappingType } from '@/utils/widgetUtils';
import { LayoutItem } from '@/types/mapping';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import mirageServer from '@/lib/mirage/mirageServer';
mirageServer();
const MappingScreen: React.FC = () => {
  // Get URL parameters
  const [urlParams, setUrlParams] = useState({
    sectionName: '',
    isExpanded: '',
  });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // Load URL params after hydration
    setIsClient(true);
    const searchParams = new URLSearchParams(window.location.search);
    setUrlParams({
      sectionName: searchParams.get('sectionName') || '',
      isExpanded: searchParams.get('expanded') || '',
    });
  }, []);
  // Use destructured values
  const { sectionName, isExpanded } = urlParams;
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [tabValue, setTabValue] = useState(0);

  // Custom hooks
  const {
    loading,
    reportName,
    setReportName,
    parsedResponse,
    transformedData,
    fetchReportData,
    getCHAFields,
    getKFFields,
    getCHAValues,
    getKFValue,
  } = useMappingData();

  const {
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
    initializeWidgetMappingConfig,
    handleWidgetClick,
  } = useWidgetConfiguration();

  const {
    hybridDatasets,
    setHybridDatasets,
    activeHybridDataset,
    setActiveHybridDataset,
    createHybridDatasetFromResponse,
  } = useHybridDataset();

  useEffect(() => {
    // Create hybrid dataset when data is fetched
    if (parsedResponse && parsedResponse.chartData) {
      const hybridDataset = createHybridDatasetFromResponse(
        parsedResponse,
        reportName,
      );
      setHybridDatasets([hybridDataset]);
      setActiveHybridDataset(hybridDataset);
    }
  }, [
    parsedResponse,
    reportName,
    createHybridDatasetFromResponse,
    setHybridDatasets,
    setActiveHybridDataset,
  ]);

  const addWidget = (name: string) => {
    const widgetId = `widget-${Date.now()}`;
    const { w, h } = widgetSizes[name] || { w: 2, h: 2 };

    setWidgets((prev) => [...prev, { id: widgetId, name, props: {} }]);
    setLayout((prev) => [
      ...prev,
      { i: widgetId, x: 0, y: Infinity, w, h, static: false, sectionName },
    ]);

    initializeWidgetMappingConfig(widgetId, name, reportName);
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
    setLayout((prev) => prev.filter((item) => item.i !== id));

    setFieldMappings((prev) => {
      const newMappings = { ...prev };
      delete newMappings[id];
      return newMappings;
    });

    setWidgetConfigurations((prev) => {
      const newConfigs = { ...prev };
      delete newConfigs[id];
      return newConfigs;
    });

    if (selectedWidget === id) {
      setSelectedWidget(null);
      setPreviewData(null);
    }
  };

  const saveLayout = () => {
    const updatedLayout = layout.map((item) => ({ ...item }));

    const cleanedFieldMappings = Object.entries(fieldMappings).reduce(
      (acc, [widgetId, config]) => {
        acc[widgetId] = JSON.parse(JSON.stringify(config));
        return acc;
      },
      {} as any,
    );

    const widgetsWithCompleteData = widgets.map((widget) => {
      const widgetConfig = widgetConfigurations[widget.id] || {};
      const { widgetType, roles, ...cleanProps } = widgetConfig;

      return {
        ...widget,
        props: cleanProps,
        roles: roles || [],
        widgetType: widgetType,
      };
    });

    let payload = JSON.parse(sessionStorage.getItem('payload') || '[]');
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }

    const newEntry = {
      sectionName: sectionName,
      layout: updatedLayout,
      fieldMappings: cleanedFieldMappings,
      widgets: widgetsWithCompleteData,
      expanded: isExpanded,
      hybridDatasets: hybridDatasets,
    };

    payload.push(newEntry);
    sessionStorage.setItem('payload', JSON.stringify(payload));

    alert('Layout saved successfully!');
    window.location.href = '/';
  };

  const handleTabChange = (event: React.ChangeEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReportNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newReportName = event.target.value;
    setReportName(newReportName);

    if (selectedWidget) {
      setFieldMappings((prev) => ({
        ...prev,
        [selectedWidget]: {
          ...prev[selectedWidget],
          reportName: newReportName,
        },
      }));
    }
  };

  // Field mapping handlers
  const handleFieldMappingTypeChange = (
    field: string,
    inputType: 'manual' | 'mapped',
  ) => {
    if (!selectedWidget) return;

    setFieldMappings((prev) => ({
      ...prev,
      [selectedWidget]: {
        ...prev[selectedWidget],
        fields: {
          ...prev[selectedWidget].fields,
          [field]: {
            ...prev[selectedWidget].fields[field],
            inputType,
          },
        },
      },
    }));
  };

  const handleManualValueChange = (field: string, value: any) => {
    if (!selectedWidget) return;

    setFieldMappings((prev) => ({
      ...prev,
      [selectedWidget]: {
        ...prev[selectedWidget],
        fields: {
          ...prev[selectedWidget].fields,
          [field]: {
            ...prev[selectedWidget].fields[field],
            inputType: 'manual',
            manualValue: value,
          },
        },
      },
    }));
  };

  const handleMappedFieldSelection = (
    field: string,
    chaField: string,
    chaValue: string,
    kfField: string,
  ) => {
    if (!selectedWidget) return;

    setFieldMappings((prev) => ({
      ...prev,
      [selectedWidget]: {
        ...prev[selectedWidget],
        fields: {
          ...prev[selectedWidget].fields,
          [field]: {
            ...prev[selectedWidget].fields[field],
            inputType: 'mapped',
            mappedConfig: {
              chaField,
              chaValue,
              kfField,
            },
          },
        },
      },
    }));
  };

  // Calculate tab indices
  const getTabIndex = (baseIndex: number): number => {
    let index = baseIndex;
    if (fieldMappings[selectedWidget || '']?.mappingType === 'chart') index++;
    if (fieldMappings[selectedWidget || '']?.mappingType === 'table') index++;
    if (fieldMappings[selectedWidget || '']?.mappingType === 'quadrant')
      index++;
    return index;
  };

  // Show loading until client-side data is loaded
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative flex h-screen w-full">
        {/* Sidebar */}
        <div className="h-full bg-white">
          <SidebarMapping onItemClick={addWidget} />
        </div>

        {/* Main content area */}
        <Splitter className="h-100vh w-full overflow-y-auto" layout="vertical">
          <SplitterPanel>
            <WidgetGrid
              widgets={widgets}
              layout={layout}
              sectionName={sectionName}
              selectedWidget={selectedWidget}
              widgetConfigurations={widgetConfigurations}
              previewData={previewData}
              onLayoutChange={(newLayout) =>
                setLayout(newLayout as LayoutItem[])
              }
              onWidgetClick={handleWidgetClick}
              onRemoveWidget={removeWidget}
            />
          </SplitterPanel>
        </Splitter>

        {/* Configuration panel */}
        <div className="flex h-screen w-1/3 flex-col overflow-auto bg-gradient-to-b from-[#00214E] to-[#0164B0] p-4 text-white">
          <div className="h-full overflow-y-auto">
            <Typography variant="h6" component="h2" gutterBottom>
              Widget Configuration
            </Typography>

            {selectedWidget ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Configure Widget
                </Typography>

                {/* Report Configuration */}
                <Paper
                  elevation={2}
                  sx={{ p: 2, mb: 2, backgroundColor: '#ffffff20' }}
                >
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <TextField
                      label="Report Technical Name"
                      value={reportName}
                      onChange={handleReportNameChange}
                      helperText="Enter the technical name of the SAP BW report"
                      sx={{
                        input: { color: 'white' },
                        label: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'white' },
                          '&:hover fieldset': { borderColor: 'white' },
                          '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiFormHelperText-root': { color: 'white' },
                      }}
                    />
                    <Button
                      label="Fetch Report Data"
                      onClick={fetchReportData}
                      className="mt-2"
                    />
                  </FormControl>
                </Paper>

                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : parsedResponse ? (
                  <>
                    {/* Configuration tabs */}
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="mapping tabs"
                      className="!bg-[#ffffff20]"
                      variant="scrollable"
                      scrollButtons={false}
                    >
                      <Tab
                        icon={<SettingsIcon />}
                        label="Basic Mapping"
                        className="!text-white"
                      />

                      {fieldMappings[selectedWidget]?.mappingType ===
                        'chart' && (
                        <Tab
                          icon={<DataIcon />}
                          label="Chart Config"
                          className="!text-white"
                        />
                      )}

                      {fieldMappings[selectedWidget]?.mappingType ===
                        'table' && (
                        <Tab
                          icon={<DataIcon />}
                          label="Table Config"
                          className="!text-white"
                        />
                      )}

                      {fieldMappings[selectedWidget]?.mappingType ===
                        'quadrant' && (
                        <Tab
                          icon={<DataIcon />}
                          label="Quadrant Config"
                          className="!text-white"
                        />
                      )}

                      <Tab
                        icon={<AccountTreeIcon />}
                        label="Hybrid Mapping"
                        className="!text-white"
                      />
                      <Tab
                        icon={<PreviewIcon />}
                        label="Data Preview"
                        className="!text-white"
                      />
                      <Tab
                        icon={<VisibilityIcon />}
                        label="Widget Preview"
                        className="!text-white"
                      />
                      <Tab
                        icon={<SecurityIcon />}
                        label="Authorization"
                        className="!text-white"
                      />
                    </Tabs>

                    {/* Basic Field Mapping Tab */}
                    <TabPanel value={tabValue} index={0}>
                      <BasicMappingTab
                        selectedWidget={selectedWidget}
                        widgets={widgets}
                        fieldMappings={fieldMappings}
                        parsedResponse={parsedResponse}
                        transformedData={transformedData}
                        onFieldMappingTypeChange={handleFieldMappingTypeChange}
                        onManualValueChange={handleManualValueChange}
                        onMappedFieldSelection={handleMappedFieldSelection}
                        getCHAFields={getCHAFields}
                        getKFFields={getKFFields}
                        getCHAValues={getCHAValues}
                        getKFValue={getKFValue}
                      />
                    </TabPanel>

                    {/* Add other tab panels here */}
                  </>
                ) : (
                  <Typography sx={{ color: 'white' }}>
                    Enter a report name and fetch data to configure the widget
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography sx={{ color: 'white' }}>
                Select a widget to configure it
              </Typography>
            )}

            <div className="p-4">
              <Box mt={4} pt={2} borderColor="rgba(255,255,255,0.2)">
                <Button label="Save Layout" onClick={saveLayout} />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default MappingScreen;
