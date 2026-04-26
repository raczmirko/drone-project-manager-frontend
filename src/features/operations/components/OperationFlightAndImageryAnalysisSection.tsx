import { Stack } from '@mui/material';
import { type GridPaginationModel } from '@mui/x-data-grid';
import SectionCard from '../../projects/components/SectionCard.tsx';
import OperationImageMetadataUploadCard from './OperationImageMetadataUploadCard.tsx';
import OperationImageMetadataGrid from './OperationImageMetadataGrid.tsx';
import OperationFlightAnalysisCard from './OperationFlightAnalysisCard.tsx';
import type {
    OperationFlightAnalysisResponse,
    OperationImageMetadataExtractionResponse,
    OperationImageMetadataRow,
} from '../types/operationImageMetadataTypes.ts';
import {useTranslation} from "react-i18next";

type OperationFlightAndImageryAnalysisSectionProps = {
    uploadLoading: boolean;
    uploadError: string | null;
    uploadResult: OperationImageMetadataExtractionResponse | null;
    onUpload: (files: File[]) => Promise<void>;

    analysis: OperationFlightAnalysisResponse | null;
    analysisLoading: boolean;
    analysisError: string | null;
    onAnalyze: () => Promise<void>;

    rows: OperationImageMetadataRow[];
    gridLoading: boolean;
    gridError: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
};

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
                                                                     rows,
                                                                     gridLoading,
                                                                     gridError,
                                                                     rowCount,
                                                                     paginationModel,
                                                                     onPaginationModelChange,
                                                                 }: OperationFlightAndImageryAnalysisSectionProps) {
    const { t } = useTranslation();
    return (
        <SectionCard title={t("operations.imageAnalysis.title")}>
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