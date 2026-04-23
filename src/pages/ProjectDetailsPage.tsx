import { useState } from 'react';
import { Alert, Box, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog.tsx';
import { projectApi } from '../features/projects/api/projectApi';
import DocumentsSection from '../features/projects/components/DocumentsSection';
import OperationsSection from '../features/projects/components/OperationsSection';
import ProjectHeader from '../features/projects/components/ProjectHeader';
import ProjectSummaryCard from '../features/projects/components/ProjectSummaryCard';
import { useProjectDetails } from '../features/projects/hooks/useProjectDetails';
import { useProjectDocuments } from '../features/projects/hooks/useProjectDocuments';
import { useProjectOperations } from '../features/projects/hooks/useProjectOperations';

export default function ProjectDetailsPage() {
    const { id: code = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const project = useProjectDetails(code);
    const operations = useProjectOperations(code);
    const documents = useProjectDocuments(code);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteProject = async () => {
        if (!code) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            await projectApi.deleteByCode(code);
            navigate('/projects');
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Unknown error');
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
                    <ProjectHeader onDelete={() => setOpenConfirmDialog(true)} />

                    {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}

                    <ProjectSummaryCard
                        project={project.data}
                        loading={project.loading}
                        error={project.error}
                    />

                    <OperationsSection
                        projectCode={code}
                        rows={operations.rows}
                        loading={operations.loading}
                        error={operations.error}
                        rowCount={operations.rowCount}
                        paginationModel={operations.paginationModel}
                        onPaginationModelChange={operations.setPaginationModel}
                        onCreateOperation={operations.createOperation}
                        createLoading={operations.createLoading}
                        createError={operations.createError}
                        onResetCreateError={operations.resetCreateError}
                    />

                    <DocumentsSection
                        projectCode={code}
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
                    />
                </Stack>

                <ConfirmationDialog
                    open={openConfirmDialog}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    onConfirm={handleDeleteProject}
                    onCancel={() => setOpenConfirmDialog(false)}
                    confirmLabel={deleteLoading ? 'Deleting...' : 'Delete'}
                    cancelLabel="Cancel"
                />
            </Box>
        </Box>
    );
}
