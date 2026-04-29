import React, {useMemo, useState} from 'react';
import {Alert, Box, Button, CircularProgress, IconButton, Tooltip} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {DataGrid, type GridColDef, type GridPaginationModel,} from '@mui/x-data-grid';
import {useTranslation} from 'react-i18next';
import SectionCard from './SectionCard';
import type {ProjectDocument} from '../types/projectTypes';
import {formatDate, formatFileSize} from '../../../utils/formatters.ts';
import {useProjectFileDownload} from "../hooks/useProjectFileDownload.ts";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog.tsx";

type DocumentsSectionProps = {
    projectCode: string;
    rows: ProjectDocument[];
    loading: boolean;
    error: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    onUploadDocument: (file: File) => Promise<boolean>;
    uploadLoading: boolean;
    uploadError: string | null;
    onResetUploadError: () => void;
    onDeleteDocument: (documentId: string) => Promise<boolean>;
    deleteLoading: boolean;
};

export default function DocumentsSection({
                                             projectCode,
                                             rows,
                                             loading,
                                             error,
                                             rowCount,
                                             paginationModel,
                                             onPaginationModelChange,
                                             onUploadDocument,
                                             uploadLoading,
                                             uploadError,
                                             onResetUploadError,
                                             onDeleteDocument,
                                             deleteLoading,
                                         }: DocumentsSectionProps) {
    const { t } = useTranslation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<ProjectDocument | null>(null);

    const {
        downloadFile,
        downloadLoading,
        downloadError,
        resetDownloadError,
    } = useProjectFileDownload();

    const handleDeleteDialogCancel = () => {
        setIsDeleteDialogOpen(false);
        setDocumentToDelete(null);
    };

    const handleDeleteDialogConfirm = async () => {
        if (!documentToDelete) {
            return;
        }

        const success = await onDeleteDocument(documentToDelete.id);

        if (success) {
            setIsDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }
    };

    const columns = useMemo<GridColDef<ProjectDocument>[]>(
        () => [
            {
                field: 'filename',
                headerName: t('documents.fields.fileName'),
                flex: 1.6,
                minWidth: 220,
            },
            {
                field: 'uploadDate',
                headerName: t('documents.fields.uploadedAt'),
                flex: 1,
                minWidth: 160,
                valueGetter: (_value, row) => formatDate(row.uploadDate),
            },
            {
                field: 'size',
                headerName: t('documents.fields.size'),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) => formatFileSize(row.sizeBytes),
            },
            {
                field: 'actions',
                headerName: t('general.actions.title'),
                sortable: false,
                filterable: false,
                width: 80,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Tooltip title={t('documents.downloadFile')}>
                            <IconButton
                                size="small"
                                aria-label={t('documents.downloadFile')}
                                disabled={deleteLoading || downloadLoading}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    void downloadFile({
                                        projectCode,
                                        documentId: params.row.id,
                                        fileName: params.row.filename,
                                    });
                                }}
                            >
                                <DownloadOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('documents.deleteFile')}>
                            <IconButton
                                size="small"
                                color="error"
                                aria-label={t('documents.deleteFile')}
                                disabled={deleteLoading || downloadLoading}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setDocumentToDelete(params.row);
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            }
        ],
        [deleteLoading, downloadFile, downloadLoading, projectCode, t],
    );

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onResetUploadError();

        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        await onUploadDocument(file);
        event.target.value = '';
    };

    return (
        <>
            {/*DOCUMENTS SECTION*/}
            <SectionCard
                title={t('documents.title')}
                action={
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={uploadLoading ? <CircularProgress color="inherit" size={18} /> : <UploadFileOutlinedIcon />}
                        sx={{ ml: 'auto' }}
                        disabled={uploadLoading}
                    >
                        {t('documents.uploadFile')}
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                }
            >
                {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
                {uploadError ? <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert> : null}
                {downloadError ? (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={resetDownloadError}>
                        {downloadError}
                    </Alert>
                ) : null}


                <Box sx={{ height: 420, width: '100%', overflowX: 'auto', boxSizing: 'border-box' }}>
                    <Box sx={{ height: '100%', minWidth: { xs: '800px', md: 'auto' }, boxSizing: 'border-box' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.id}
                            loading={loading}
                            pagination
                            paginationMode="server"
                            rowCount={rowCount}
                            pageSizeOptions={[5, 10, 20]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={onPaginationModelChange}
                            disableRowSelectionOnClick
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'grey.100',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </SectionCard>

            {/*DELETE DOCUMENT DIALOG*/}
            <ConfirmationDialog
                open={isDeleteDialogOpen}
                title={t('general.actions.confirm')}
                message={
                    documentToDelete
                        ? t('documents.confirmDelete', {
                            filename: documentToDelete.filename,
                        })
                        : ''
                }
                onConfirm={handleDeleteDialogConfirm}
                onCancel={handleDeleteDialogCancel}
                confirmLabel={t('general.actions.delete')}
                cancelLabel={t('general.actions.cancel')}
            />
        </>
    );
}
