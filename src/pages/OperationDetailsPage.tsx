import {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Stack} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog.tsx';
import DocumentsSection from '../features/projects/components/DocumentsSection';
import {operationApi} from '../features/operations/api/operationApi';
import {useOperationDetails} from '../features/operations/hooks/useOperationDetails';
import {useOperationDocuments} from '../features/operations/hooks/useOperationDocuments';
import {useProjectOperations} from '../features/projects/hooks/useProjectOperations';
import {useLocations} from '../features/projects/hooks/useLocations';
import OperationDetailsPageHeader from '../features/operations/components/OperationDetailsPageHeader.tsx';
import OperationSummaryCard from '../features/operations/components/OperationSummaryCard';
import EditOperationDialogContainer from '../features/operations/containers/EditOperationDialogContainer.tsx';
import type {UpdateDroneOperationRequest} from "../features/operations/types/operationTypes.ts";
import type {
    OperationFlightAnalysisResponse,
    OperationImageMetadataExtractionResponse,
    OperationImageMetadataRow
} from "../features/operations/types/operationImageMetadataTypes.ts";
import type {GridPaginationModel} from "@mui/x-data-grid";
import OperationFlightAndImageryAnalysisSection
    from "../features/operations/components/OperationFlightAndImageryAnalysisSection.tsx";
import type {OperationFlightPathPoint} from "../features/operations/types/operationAnalysisTypes.ts";

/**
 * Displays the details page for a specific operation within a project.
 * This page includes metadata management, flight path visualization, and operation summary.
 */
export default function OperationDetailsPage() {

    const { projectCode = '', operationCode = '' } = useParams<{ projectCode: string; operationCode: string; }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const operation = useOperationDetails(projectCode, operationCode);
    const documents = useOperationDocuments(projectCode, operationCode);
    const locations = useLocations();
    const operations = useProjectOperations(projectCode);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadResult, setUploadResult] = useState<OperationImageMetadataExtractionResponse | null>(null);

    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<OperationFlightAnalysisResponse | null>(null);

    const [gridLoading, setGridLoading] = useState(false);
    const [gridError, setGridError] = useState<string | null>(null);
    const [rows, setRows] = useState<OperationImageMetadataRow[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});

    const [flightPathLoading, setFlightPathLoading] = useState(false);
    const [flightPathError, setFlightPathError] = useState<string | null>(null);
    const [flightPathRows, setFlightPathRows] = useState<OperationFlightPathPoint[]>([]);

    // Keep track of whether the metadata grid has been initialized to auto-switch tabs if there are images, otherwise stay on first tab
    const [metadataInitialized, setMetadataInitialized] = useState(false);

    /**
     * Loads the flight path for the current operation.
     */
    const loadFlightPath = useCallback(async () => {
        if (!operationCode) {
            return;
        }

        setFlightPathLoading(true);
        setFlightPathError(null);

        try {
            const data = await operationApi.getFlightPath(operationCode);
            setFlightPathRows(data);
        } catch (error) {
            setFlightPathError(
                error instanceof Error ? error.message : t('general.errors.unknown'),
            );
        } finally {
            setFlightPathLoading(false);
        }
    }, [operationCode, t]);

    /**
     * Loads the metadata page for the given pagination model.
     */
    const loadMetadataPage = useCallback(
        async (model: GridPaginationModel) => {
            if (!operationCode) {
                return;
            }

            setGridLoading(true);
            setGridError(null);

            try {
                const data = await operationApi.getImageMetadata(
                    operationCode,
                    model.page,
                    model.pageSize,
                );

                setRows(data.content);
                setRowCount(data.totalElements);
            } catch (error) {
                setGridError(error instanceof Error ? error.message : t('general.errors.unknown'));
            } finally {
                setGridLoading(false);
                setMetadataInitialized(true);
            }
        },
        [operationCode, t],
    );

    /**
     * Handles the analysis of flight data.
     */
    const loadAnalysis = useCallback(async () => {
        if (!operationCode) {
            return;
        }

        setAnalysisLoading(true);
        setAnalysisError(null);

        try {
            const data = await operationApi.analyzeImageMetadata(operationCode);
            setAnalysis(data);
        } catch (error) {
            setAnalysisError(error instanceof Error ? error.message : t('general.errors.unknown'));
        } finally {
            setAnalysisLoading(false);
        }
    }, [operationCode, t]);

    /**
     * Handles the upload of images to the server.
     */
    const handleUpload = async (files: File[]) => {
        if (!operationCode) {
            return;
        }

        setUploadLoading(true);
        setUploadError(null);

        try {
            const data = await operationApi.extractImageMetadata(operationCode, files);
            setUploadResult(data);

            const firstPageModel = {
                page: 0,
                pageSize: paginationModel.pageSize,
            };

            setPaginationModel(firstPageModel);

            await Promise.all([
                loadMetadataPage(firstPageModel),
                loadFlightPath(),
                loadAnalysis(),
            ]);

        } catch (error) {
            setUploadError(error instanceof Error ? error.message : t('general.errors.unknown'));
        } finally {
            setUploadLoading(false);
        }
    };

    /**
     * Handles the deletion of an operation.
     */
    const handleDeleteOperation = async () => {
        if (!projectCode || !operationCode) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            await operationApi.deleteById(projectCode, operationCode);
            navigate(`/projects/${projectCode}`);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : t('general.errors.unknown'));
        } finally {
            setDeleteLoading(false);
            setOpenConfirmDialog(false);
        }
    };

    /**
     * Handles the update of an operation.
     */
    const handleUpdateOperation = useCallback(
        async (opCode: string, payload: UpdateDroneOperationRequest) => {
            const success = await operations.updateOperation(opCode, payload);

            if (success) {
                await operation.refetch();
            }

            return success;
        },
        [operations, operation],
    );

    const handleAnalyze = useCallback(async () => {
        await loadAnalysis();
    }, [loadAnalysis]);

    useEffect(() => {
        void loadMetadataPage(paginationModel);
    }, [loadMetadataPage, paginationModel]);

    useEffect(() => {
        void loadFlightPath();
    }, [loadFlightPath]);

    useEffect(() => {
        if (!operationCode) {
            return;
        }

        let cancelled = false;

        const runInitialAnalysis = async () => {
            setAnalysisLoading(true);
            setAnalysisError(null);

            try {
                const data = await operationApi.analyzeImageMetadata(operationCode);

                if (cancelled) {
                    return;
                }

                setAnalysis(data);
                await operation.refetch();
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setAnalysisError(
                    error instanceof Error ? error.message : t('general.errors.unknown'),
                );
            } finally {
                if (!cancelled) {
                    setAnalysisLoading(false);
                }
            }
        };

        void runInitialAnalysis();

        return () => {
            cancelled = true;
        };
    }, [operationCode, t]);

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1200,
                    px: { xs: 2, md: 0 },
                }}
            >
                <Stack spacing={3}>
                    <OperationDetailsPageHeader
                        onDelete={() => setOpenConfirmDialog(true)}
                        editAction={
                            operation.data ? (
                                <EditOperationDialogContainer
                                    operation={operation.data}
                                    availableLocations={locations.rows}
                                    locationsLoading={locations.loading}
                                    locationsError={locations.error}
                                    onCreateLocation={locations.createLocation}
                                    locationCreateLoading={locations.createLoading}
                                    locationCreateError={locations.createError}
                                    onResetLocationCreateError={locations.resetCreateError}
                                    onUpdateOperation={handleUpdateOperation}
                                    updateLoading={operations.updateLoading}
                                    updateError={operations.updateError}
                                    onResetUpdateError={operations.resetUpdateError}
                                />
                            ) : null
                        }
                    />

                    {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}

                    <OperationSummaryCard
                        operation={operation.data}
                        loading={operation.loading}
                        error={operation.error}
                    />

                    <OperationFlightAndImageryAnalysisSection
                        uploadLoading={uploadLoading}
                        uploadError={uploadError}
                        uploadResult={uploadResult}
                        onUpload={handleUpload}
                        analysis={analysis}
                        analysisLoading={analysisLoading}
                        analysisError={analysisError}
                        onAnalyze={handleAnalyze}
                        flightPathRows={flightPathRows}
                        flightPathLoading={flightPathLoading}
                        flightPathError={flightPathError}
                        rows={rows}
                        gridLoading={gridLoading}
                        gridError={gridError}
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        metadataInitialized={metadataInitialized}
                    />

                    <DocumentsSection
                        projectCode={projectCode}
                        rows={documents.rows}
                        loading={documents.loading}
                        error={documents.error}
                        rowCount={documents.rowCount}
                        paginationModel={documents.paginationModel}
                        onPaginationModelChange={documents.setPaginationModel}
                        onUploadDocument={documents.uploadDocument}
                        uploadLoading={documents.uploadLoading}
                        uploadError={documents.uploadError}
                        onResetUploadError={documents.resetUploadError}
                        onDeleteDocument={documents.deleteDocument}
                        deleteLoading={documents.deleteLoading}
                    />
                </Stack>

                <ConfirmationDialog
                    open={openConfirmDialog}
                    title={t('operations.details.deleteTitle')}
                    message={t('operations.details.deleteMessage')}
                    onConfirm={handleDeleteOperation}
                    onCancel={() => setOpenConfirmDialog(false)}
                    confirmLabel={
                        deleteLoading ? t('general.actions.deleting') : t('general.actions.delete')
                    }
                    cancelLabel={t('general.actions.cancel')}
                />
            </Box>
        </Box>
    );
}