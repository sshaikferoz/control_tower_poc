'use client';
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Box,
  Alert,
} from '@mui/material';
import { widgetConfigFields } from '@/helpers/types';

interface BasicMappingTabProps {
  selectedWidget: string | null;
  widgets: any[];
  fieldMappings: any;
  parsedResponse: any;
  transformedData: any;
  onFieldMappingTypeChange: (
    field: string,
    inputType: 'manual' | 'mapped',
  ) => void;
  onManualValueChange: (field: string, value: any) => void;
  onMappedFieldSelection: (
    field: string,
    chaField: string,
    chaValue: string,
    kfField: string,
  ) => void;
  getCHAFields: () => any[];
  getKFFields: () => any[];
  getCHAValues: (chaField: string) => string[];
  getKFValue: (chaField: string, chaValue: string, kfField: string) => any;
}

export const BasicMappingTab: React.FC<BasicMappingTabProps> = ({
  selectedWidget,
  widgets,
  fieldMappings,
  parsedResponse,
  transformedData,
  onFieldMappingTypeChange,
  onManualValueChange,
  onMappedFieldSelection,
  getCHAFields,
  getKFFields,
  getCHAValues,
  getKFValue,
}) => {
  const getSelectedWidgetType = () => {
    if (!selectedWidget) return null;
    const widget = widgets.find((w) => w.id === selectedWidget);
    return widget ? widget.name : null;
  };

  const getWidgetConfigFields = () => {
    const widgetType = getSelectedWidgetType();
    return widgetType
      ? widgetConfigFields[widgetType as keyof typeof widgetConfigFields] || []
      : [];
  };

  return (
    <div>
      {getWidgetConfigFields().map(({ field }) => {
        const fieldMapping = fieldMappings[selectedWidget || '']?.fields[field];
        const isManualInput = fieldMapping?.inputType === 'manual';
        const mappedConfig = fieldMapping?.mappedConfig;

        return field !== 'data' &&
          field !== 'chart_data' &&
          field !== 'chart_yaxis' &&
          field !== 'series' &&
          field !== 'metrics' &&
          field !== 'menuItems' &&
          field !== 'chartData' ? (
          <FormControl fullWidth variant="outlined" margin="normal" key={field}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
              {field}
            </Typography>

            {/* Input Type Selection */}
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
              size="small"
            >
              <InputLabel sx={{ color: 'white' }}>Input Type</InputLabel>
              <Select
                value={isManualInput ? 'manual' : 'mapped'}
                onChange={(e) =>
                  onFieldMappingTypeChange(
                    field,
                    e.target.value as 'manual' | 'mapped',
                  )
                }
                label="Input Type"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                <MenuItem value="manual">Manual Input</MenuItem>
                <MenuItem value="mapped">Mapped Input</MenuItem>
              </Select>
            </FormControl>

            {/* Manual Input Field */}
            {isManualInput ? (
              <TextField
                label={`Value for ${field}`}
                value={fieldMapping?.manualValue || ''}
                onChange={(e) => onManualValueChange(field, e.target.value)}
                fullWidth
                margin="normal"
                size="small"
                sx={{
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                }}
              />
            ) : (
              /* Mapped Input Field Configuration */
              <Box
                mt={2}
                p={2}
                border={1}
                borderColor="rgba(255,255,255,0.3)"
                borderRadius={1}
                sx={{ backgroundColor: '#ffffff10' }}
              >
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
                  Data Mapping Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: 'white' }}>CHA Field</InputLabel>
                      <Select
                        value={mappedConfig?.chaField || ''}
                        onChange={(e) => {
                          const chaField = e.target.value as string;
                          onMappedFieldSelection(
                            field,
                            chaField,
                            mappedConfig?.chaValue || '',
                            mappedConfig?.kfField || '',
                          );
                        }}
                        label="CHA Field"
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '& .MuiSvgIcon-root': { color: 'white' },
                        }}
                      >
                        {getCHAFields().map((chaField: any) => (
                          <MenuItem
                            key={chaField.fieldName}
                            value={chaField.fieldName}
                          >
                            {chaField.label} ({chaField.fieldName})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {mappedConfig?.chaField && (
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'white' }}>
                          CHA Value
                        </InputLabel>
                        <Select
                          value={mappedConfig?.chaValue || ''}
                          onChange={(e) => {
                            const chaValue = e.target.value as string;
                            onMappedFieldSelection(
                              field,
                              mappedConfig?.chaField || '',
                              chaValue,
                              mappedConfig?.kfField || '',
                            );
                          }}
                          label="CHA Value"
                          sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { color: 'white' },
                          }}
                        >
                          {getCHAValues(mappedConfig?.chaField).map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {mappedConfig?.chaField && mappedConfig?.chaValue && (
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'white' }}>
                          KF Field
                        </InputLabel>
                        <Select
                          value={mappedConfig?.kfField || ''}
                          onChange={(e) => {
                            const kfField = e.target.value as string;
                            onMappedFieldSelection(
                              field,
                              mappedConfig?.chaField || '',
                              mappedConfig?.chaValue || '',
                              kfField,
                            );
                          }}
                          label="KF Field"
                          sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { color: 'white' },
                          }}
                        >
                          {getKFFields().map((kfField: any) => (
                            <MenuItem
                              key={kfField.fieldName}
                              value={kfField.fieldName}
                            >
                              {kfField.label} ({kfField.fieldName})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {mappedConfig?.chaField &&
                    mappedConfig?.chaValue &&
                    mappedConfig?.kfField && (
                      <Grid item xs={12}>
                        <Alert
                          severity="success"
                          sx={{ backgroundColor: '#4caf5020' }}
                        >
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            Mapped Value:{' '}
                            {getKFValue(
                              mappedConfig.chaField,
                              mappedConfig.chaValue,
                              mappedConfig.kfField,
                            ) || 'No data'}
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                </Grid>
              </Box>
            )}
          </FormControl>
        ) : null;
      })}
    </div>
  );
};
