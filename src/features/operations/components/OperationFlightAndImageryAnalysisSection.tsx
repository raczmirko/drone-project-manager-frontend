import {Stack} from '@mui/material';
import SectionCard from '../../projects/components/SectionCard.tsx';
import OperationImageMetadataUploadCard from './OperationImageMetadataUploadCard.tsx';
import OperationImageMetadataGrid from './OperationImageMetadataGrid.tsx';
import OperationFlightAnalysisCard from './OperationFlightAnalysisCard.tsx';
import {useTranslation} from "react-i18next";
import OperationFlightPathMap from "./OperationFlightPathMap.tsx";
import type {OperationFlightAndImageryAnalysisSectionProps} from "../types/operationAnalysisTypes.ts";

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
                                                                 }: OperationFlightAndImageryAnalysisSectionProps) {
    const { t } = useTranslation();

    return (
        <SectionCard title={t('operations.imageAnalysis.title')}>
            <Stack spacing={3}>
                <OperationImageMetadataUploadCard
                    loading={uploadLoading}
                    error={uploadError}
                    uploadResult={uploadResult}
                    onUpload={onUpload}
                />

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

                <OperationImageMetadataGrid
                    rows={rows}
                    loading={gridLoading}
                    error={gridError}
                    rowCount={rowCount}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                />
            </Stack>
        </SectionCard>
    );
}