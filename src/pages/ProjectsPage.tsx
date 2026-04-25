import {useMemo, useState} from 'react';
import {Alert, Box, IconButton, Paper, Tooltip,} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {DataGrid, type GridColDef,} from '@mui/x-data-grid';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import CreateProjectDialog from '../components/dialogs/CreateProjectDialog';
import {EMPTY_PROJECT_FORM, useProjects} from '../features/projects/hooks/useProjects';
import type {CreateProjectFormValues, Project} from '../features/projects/types/projectTypes';
import ProjectsPageHeader from "../features/projects/components/ProjectsPageHeader.tsx";

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const projects = useProjects();

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState<CreateProjectFormValues>(EMPTY_PROJECT_FORM);

    const columns = useMemo<GridColDef<Project>[]>(
        () => [
            {
                field: 'code',
                headerName: t('projects.fields.code'),
                flex: 1,
                minWidth: 130,
            },
            {
                field: 'name',
                headerName: t('projects.fields.name'),
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'status',
                headerName: t('projects.fields.status'),
                flex: 1,
                minWidth: 130,
                valueGetter: (_value, row) => row.status ?? '-',
            },
            {
                field: 'startDate',
                headerName: t('projects.fields.startDate'),
                flex: 1,
                minWidth: 130,
                valueGetter: (_value, row) => row.startDate ?? '-',
            },
            {
                field: 'endDate',
                headerName: t('projects.fields.endDate'),
                flex: 1,
                minWidth: 130,
                valueGetter: (_value, row) => row.endDate ?? '-',
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
                    <Tooltip title={t('general.actions.seeDetails')}>
                        <IconButton
                            size="small"
                            aria-label={t('general.actions.seeDetails')}
                            onClick={() => navigate(`/projects/${params.row.code}`)}
                        >
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [navigate, t],
    );

    const handleOpenCreateDialog = () => {
        setFormData(EMPTY_PROJECT_FORM);
        projects.resetCreateError();
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        if (!projects.createLoading) {
            setOpenCreateDialog(false);
        }
    };

    const handleChange =
        (field: keyof CreateProjectFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setFormData((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                }));
            };

    const handleSubmitCreate = async () => {
        const success = await projects.createProject(formData);
        if (success) {
            setOpenCreateDialog(false);
            setFormData(EMPTY_PROJECT_FORM);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
            <Box sx={{ width: '100%', maxWidth: 1200, px: { xs: 2, md: 0 } }}>
                <ProjectsPageHeader onAdd={() => handleOpenCreateDialog()} />

                {projects.error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {projects.error}
                    </Alert>
                ) : null}

                {projects.createError ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {projects.createError}
                    </Alert>
                ) : null}

                <Paper elevation={0} sx={{ height: 650, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                    <DataGrid
                        rows={projects.rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        loading={projects.loading}
                        pagination
                        paginationMode="server"
                        rowCount={projects.rowCount}
                        pageSizeOptions={[5, 10, 20, 50]}
                        paginationModel={projects.paginationModel}
                        onPaginationModelChange={projects.setPaginationModel}
                        disableRowSelectionOnClick
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'grey.100',
                            },
                        }}
                    />
                </Paper>

                <CreateProjectDialog
                    open={openCreateDialog}
                    formData={formData}
                    createLoading={projects.createLoading}
                    onClose={handleCloseCreateDialog}
                    onSubmit={handleSubmitCreate}
                    onChange={handleChange}
                />
            </Box>
        </Box>
    );
}
