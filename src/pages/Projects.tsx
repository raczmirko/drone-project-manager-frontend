import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Box, Button, IconButton, Paper, Stack, Tooltip, Typography,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {DataGrid, type GridColDef, type GridPaginationModel,} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import CreateProjectDialog, {type CreateProjectRequest} from '../components/dialogs/CreateProjectDialog';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';

type Project = {
    id: string;
    code: string;
    name: string;
    status: string | null;
    description: string | null;
    objective: string | null;
    startDate: string | null;
    endDate: string | null;
};

type ProjectPageResponse = {
    content: Project[];
    totalElements: number;
    totalPages?: number;
    size?: number;
    number?: number;
};

const emptyForm: CreateProjectRequest = {
    code: '',
    name: '',
    status: '',
    description: '',
    objective: '',
    startDate: null,
    endDate: null,
};

export default function Projects() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [rows, setRows] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const [rowCount, setRowCount] = useState(0);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProjectRequest>(emptyForm);

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
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'startDate',
                headerName: t('projects.fields.startDate'),
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'endDate',
                headerName: t('projects.fields.endDate'),
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
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
                    <Tooltip title={t('projects.list.openProject')}>
                        <IconButton
                            size="small"
                            aria-label={t('projects.list.openProject')}
                            onClick={() => navigate(`/projects/${params.row.code}`)}
                        >
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [navigate, t]
    );

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `http://localhost:8080/projects?page=${paginationModel.page}&size=${paginationModel.pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${response.status}`);
            }

            const data: ProjectPageResponse = await response.json();

            setRows(data.content ?? []);
            setRowCount(data.totalElements ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('general.errors.unknown'));
        } finally {
            setLoading(false);
        }
    }, [paginationModel]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleOpenCreateDialog = () => {
        setFormData(emptyForm);
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        if (!createLoading) {
            setOpenCreateDialog(false);
        }
    };

    const handleChange =
        (field: keyof CreateProjectRequest) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setFormData((prev) => ({
                    ...prev,
                    [field]: event.target.value || null,
                }));
            };

    const handleSubmitCreate = async () => {
        setCreateLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            const payload = {
                ...formData,
                status: formData.status || null,
                description: formData.description || null,
                objective: formData.objective || null,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
            };

            const response = await fetch('http://localhost:8080/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to create project: ${response.status}`);
            }

            setOpenCreateDialog(false);
            setFormData(emptyForm);
            await fetchProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('general.errors.unknown'));
        } finally {
            setCreateLoading(false);
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
                    maxWidth: '60%',
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        mb: 2,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h4" component="h4">
                        {t('projects.list.title')}
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                        sx={{ ml: 'auto' }}
                    >
                        {t('projects.list.addProject')}
                    </Button>
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        height: 650,
                        width: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        loading={loading}
                        pagination
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[5, 10, 20, 50]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
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
                    createLoading={createLoading}
                    onClose={handleCloseCreateDialog}
                    onSubmit={handleSubmitCreate}
                    onChange={handleChange}
                />
            </Box>
        </Box>
    );
}