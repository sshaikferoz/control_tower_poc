import { useState, useEffect } from 'react';
import { parseXMLToJson } from '@/lib/mirage/xmltoJson';
import { transformFormMetadata } from '@/helpers/transformHelpers';
import { TransformedData } from '@/helpers/types';
import { ApiEndpoint } from '@/types/mapping';

export const useMappingData = () => {
    const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [reportName, setReportName] = useState<string>('YSCM_CT_PROC_OSS');
    const [parsedResponse, setParsedResponse] = useState<any>(null);
    const [transformedData, setTransformedData] = useState<TransformedData | null>(null);

    useEffect(() => {
        fetch('/api/endpoints')
            .then((res) => res.json())
            .then((data) => setApiEndpoints(data.endpoints))
            .catch((err) => console.error('Failed to fetch endpoints:', err));

        // Auto-fetch on component load
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        if (!reportName) return;

        setLoading(true);
        try {
            const res = await fetch(
                `/api/sap/bc/bsp/sap/zbw_reporting/execute_report_oo.htm?query=${reportName}`,
            );
            const data = await res.text();
            const parsedJSON = parseXMLToJson(data);
            setParsedResponse(parsedJSON);

            // Transform the data for easier access
            const transformed = transformFormMetadata(parsedJSON);
            setTransformedData(transformed);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCHAFields = () => {
        if (!parsedResponse || !parsedResponse.header) return [];
        return parsedResponse.header.filter((field: any) => field.type === 'CHA');
    };

    const getKFFields = () => {
        if (!parsedResponse || !parsedResponse.header) return [];
        return parsedResponse.header.filter((field: any) => field.type === 'KF');
    };

    const getCHAValues = (selectedCHA: string) => {
        if (!transformedData || !selectedCHA) return [];

        if (transformedData.FormStructure[selectedCHA]) {
            return Object.keys(transformedData.FormStructure[selectedCHA]);
        }
        return [];
    };

    const getKFValue = (chaField: string, chaValue: string, kfField: string) => {
        if (!transformedData || !chaField || !chaValue || !kfField) return null;

        try {
            return transformedData.FormStructure[chaField][chaValue][kfField];
        } catch (error) {
            return null;
        }
    };

    return {
        apiEndpoints,
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
    };
};