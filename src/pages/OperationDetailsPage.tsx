import { useState } from 'react';
import { Alert, Box, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog.tsx';
import DocumentsSection from '../features/projects/components/DocumentsSection';
import { operationApi } from '../features/operations/api/operationApi';
import { useOperationDetails } from '../features/operations/hooks/useOperationDetails';
import { useOperationDocuments } from '../features/operations/hooks/useOperationDocuments';
import OperationDetailsPageHeader from '../features/operations/components/OperationDetailsPageHeader.tsx';
import OperationSummaryCard from '../features/operations/components/OperationSummaryCard';
import {useLocations} from "../features/projects/hooks/useLocations.ts";

export default function OperationDetailsPage() {
    const { projectCode = '', operationCode = '' } = useParams<{
        projectCode: string;
        operationCode: string;
    }>();
    const navigate = useNavigate();
    const locations = useLocations();
    const { t } = useTranslation();

    const operation = useOperationDetails(projectCode, operationCode);
    const documents = useOperationDocuments(projectCode, operationCode);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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
                    />

                    {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}

                    <OperationSummaryCard
                        operation={operation.data}
                        loading={operation.loading}
                        error={operation.error}
                        onSave={operation.updateOperation}
                        saveLoading={operation.updateLoading}
                        saveError={operation.updateError}
                        onResetSaveError={operation.resetUpdateError}
                        availableLocations={locations.rows}
                        locationsLoading={locations.loading}
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