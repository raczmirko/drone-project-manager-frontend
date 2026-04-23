import { useMemo } from 'react';
import { Alert, Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import SectionCard from './SectionCard';
import type { ProjectDocument } from '../types/projectTypes';
import { displayValue, formatDate } from '../utils/projectFormatters';

const API_BASE_URL = 'http://localhost:8080';

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
                                         }: DocumentsSectionProps) {
    const { t } = useTranslation();
    const columns = useMemo<GridColDef<ProjectDocument>[]>(
        () => [
            {
                field: 'fileName',
                headerName: t('documents.fields.fileName'),
                flex: 1.6,
                minWidth: 220,
            },
            {
                field: 'type',
                headerName: t('documents.fields.type'),
                flex: 1,
                minWidth: 140,
                valueGetter: (_value, row) => displayValue(row.type),
            },
            {
                field: 'uploadedAt',
                headerName: t('documents.fields.uploadedAt'),
                flex: 1,
                minWidth: 160,
                valueGetter: (_value, row) => formatDate(row.uploadedAt),
            },
            {
                field: 'size',
                headerName: t('documents.fields.size'),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) => displayValue(row.size),
            },
            {
                field: 'actions',
                headerName: '',
                sortable: false,
                filterable: false,
                width: 80,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    <Tooltip title={t('documents.downloadFile')}>
                        <IconButton
                            size="small"
                            aria-label={t('documents.downloadFile')}
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(
                                    `${API_BASE_URL}/projects/${projectCode}/files/${params.row.id}/download`,
                                    '_blank',
                                    'noopener,noreferrer',
                                );
                            }}
                        >
                            <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [projectCode, t],
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

            <Box sx={{ height: 420, width: '100%' }}>
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
        </SectionCard>
    );
}
