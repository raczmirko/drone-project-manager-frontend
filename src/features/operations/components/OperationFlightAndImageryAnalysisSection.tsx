import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import SectionCard from '../../projects/components/SectionCard.tsx';
import OperationImageMetadataUploadCard from './OperationImageMetadataUploadCard.tsx';
import OperationImageMetadataGrid from './OperationImageMetadataGrid.tsx';
import OperationFlightAnalysisCard from './OperationFlightAnalysisCard.tsx';
import OperationFlightPathMap from './OperationFlightPathMap.tsx';
import type { OperationFlightAndImageryAnalysisSectionProps } from '../types/operationAnalysisTypes.ts';

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
};

/**
 * TabPanel component for displaying tab content.
 */
function TabPanel({ children, value, index }: TabPanelProps) {
    if (value !== index) {
        return null;
    }

    return (
        <Box
            role="tabpanel"
            id={`operation-analysis-tabpanel-${index}`}
            aria-labelledby={`operation-analysis-tab-${index}`}
            sx={{ pt: 3 }}
        >
            {children}
        </Box>
    );
}

/**
 * Section for uploading images and analyzing flight data.
 */
export default function OperationFlightAndImageryAnalysisSection({
                                                                     uploadLoading,
                                                                     uploadError,
                                                                     uploadResult,
                                                                     onUpload,
                                                                     analysis,
                                                                     analysisLoading,
                                                                     analysisError,
                                                                     onAnalyze,
                                                                     flightPathRows,
                                                                     flightPathLoading,
                                                                     flightPathError,
                                                                     rows,
                                                                     gridLoading,
                                                                     gridError,
                                                                     rowCount,
                                                                     paginationModel,
                                                                     onPaginationModelChange,
                                                                     metadataInitialized,
                                                                 }: OperationFlightAndImageryAnalysisSectionProps) {
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState(0);
    const [didAutoSelectTab, setDidAutoSelectTab] = useState(false);

    useEffect(() => {
        if (didAutoSelectTab || !metadataInitialized) {
            return;
        }

        setTabValue(rowCount > 0 ? 1 : 0);
        setDidAutoSelectTab(true);
    }, [didAutoSelectTab, metadataInitialized, rowCount]);

    return (
        <SectionCard title={t('operations.imageAnalysis.title')}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={(_event, newValue: number) => setTabValue(newValue)}
                    aria-label={t('operations.imageAnalysis.title')}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        id="operation-analysis-tab-0"
                        aria-controls="operation-analysis-tabpanel-0"
                        label={t('operations.imageAnalysis.tabs.upload')}
                    />
                    <Tab
                        id="operation-analysis-tab-1"
                        aria-controls="operation-analysis-tabpanel-1"
                        label={t('operations.imageAnalysis.tabs.flightAnalysis')}
                    />
                    <Tab
                        id="operation-analysis-tab-2"
                        aria-controls="operation-analysis-tabpanel-2"
                        label={t('operations.imageAnalysis.tabs.dashboard')}
                    />
                    <Tab
                        id="operation-analysis-tab-3"
                        aria-controls="operation-analysis-tabpanel-3"
                        label={t('operations.imageAnalysis.tabs.metadata')}
                    />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <OperationImageMetadataUploadCard
                    loading={uploadLoading}
                    error={uploadError}
                    uploadResult={uploadResult}
                    onUpload={onUpload}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Stack spacing={3}>
                    <OperationFlightAnalysisCard
                        analysis={analysis}
                        loading={analysisLoading}
                        error={analysisError}
                        onAnalyze={onAnalyze}
                    />

                    <OperationFlightPathMap
                        rows={flightPathRows}
                        loading={flightPathLoading}
                        error={flightPathError}
                    />
                </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Box>
                    Dashboard content goes here.
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <OperationImageMetadataGrid
                    rows={rows}
                    loading={gridLoading}
                    error={gridError}
                    rowCount={rowCount}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                />
            </TabPanel>
        </SectionCard>
    );
}