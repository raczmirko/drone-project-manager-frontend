import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from '@mui/x-data-grid';
import {useNavigate, useParams} from 'react-router-dom';
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog.tsx";

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

type DroneOperation = {
    id: string;
    code: string;
    name: string;
    type: string | null;
    status: string | null;
    date: string | null;
};

type ProjectDocument = {
    id: string;
    fileName: string;
    type: string | null;
    uploadedAt: string | null;
    size: string | null;
};

type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages?: number;
    size?: number;
    number?: number;
};

type CreateOperationRequest = {
    name: string;
    type: string;
    status: string;
    date: string | null;
};

const emptyOperationForm: CreateOperationRequest = {
    name: '',
    type: '',
    status: '',
    date: null,
};

export default function ProjectDetails() {
    const { id: code } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [projectLoading, setProjectLoading] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [operationsRows, setOperationsRows] = useState<DroneOperation[]>([]);
    const [operationsLoading, setOperationsLoading] = useState(false);
    const [operationsRowCount, setOperationsRowCount] = useState(0);
    const [operationsPaginationModel, setOperationsPaginationModel] =
        useState<GridPaginationModel>({
            page: 0,
            pageSize: 5,
        });

    const [documentsRows, setDocumentsRows] = useState<ProjectDocument[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [documentsRowCount, setDocumentsRowCount] = useState(0);
    const [documentsPaginationModel, setDocumentsPaginationModel] =
        useState<GridPaginationModel>({
            page: 0,
            pageSize: 5,
        });

    const [openOperationDialog, setOpenOperationDialog] = useState(false);
    const [createOperationLoading, setCreateOperationLoading] = useState(false);
    const [operationForm, setOperationForm] =
        useState<CreateOperationRequest>(emptyOperationForm);

    const token = localStorage.getItem('token');

    const fetchProject = useCallback(async () => {
        if (!code) return;

        setProjectLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/projects/${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch project: ${response.status}`);
            }

            const data: Project = await response.json();
            setProject(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setProjectLoading(false);
        }
    }, [code, token]);

    const fetchOperations = useCallback(async () => {
        if (!code) return;

        setOperationsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/projects/${code}/operations?page=${operationsPaginationModel.page}&size=${operationsPaginationModel.pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch operations: ${response.status}`);
            }

            const data: PageResponse<DroneOperation> = await response.json();
            setOperationsRows(data.content ?? []);
            setOperationsRowCount(data.totalElements ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setOperationsLoading(false);
        }
    }, [code, operationsPaginationModel, token]);

    const fetchDocuments = useCallback(async () => {
        if (!code) return;

        setDocumentsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/projects/${code}/files?page=${documentsPaginationModel.page}&size=${documentsPaginationModel.pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch documents: ${response.status}`);
            }

            const data: PageResponse<ProjectDocument> = await response.json();
            setDocumentsRows(data.content ?? []);
            setDocumentsRowCount(data.totalElements ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setDocumentsLoading(false);
        }
    }, [code, documentsPaginationModel, token]);

    useEffect(() => {
        void fetchProject();
    }, [fetchProject]);

    useEffect(() => {
        void fetchOperations();
    }, [fetchOperations]);

    useEffect(() => {
        void fetchDocuments();
    }, [fetchDocuments]);

    const operationColumns = useMemo<GridColDef<DroneOperation>[]>(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'type',
                headerName: 'Type',
                flex: 1,
                minWidth: 140,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'status',
                headerName: 'Status',
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'date',
                headerName: 'Date',
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
                    <Tooltip title="Open operation">
                        <IconButton
                            size="small"
                            aria-label="Open operation"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/projects/${code}/operations/${params.row.id}`);
                            }}
                        >
                            <VisibilityOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [navigate, code]
    );

    const documentColumns = useMemo<GridColDef<ProjectDocument>[]>(
        () => [
            {
                field: 'fileName',
                headerName: 'File name',
                flex: 1.6,
                minWidth: 220,
            },
            {
                field: 'type',
                headerName: 'Type',
                flex: 1,
                minWidth: 140,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'uploadedAt',
                headerName: 'Uploaded at',
                flex: 1,
                minWidth: 160,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'size',
                headerName: 'Size',
                flex: 0.8,
                minWidth: 120,
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
                    <Tooltip title="Download file">
                        <IconButton
                            size="small"
                            aria-label="Download file"
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(
                                    `http://localhost:8080/projects/${code}/files/${params.row.id}/download`,
                                    '_blank'
                                );
                            }}
                        >
                            <DownloadOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [code]
    );

    const handleOpenOperationDialog = () => {
        setOperationForm(emptyOperationForm);
        setOpenOperationDialog(true);
    };

    const handleCloseOperationDialog = () => {
        if (!createOperationLoading) {
            setOpenOperationDialog(false);
        }
    };

    const handleOperationChange =
        (field: keyof CreateOperationRequest) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setOperationForm((prev) => ({
                    ...prev,
                    [field]: event.target.value || null,
                }));
            };

    const handleCreateOperation = async () => {
        if (!code) return;

        setCreateOperationLoading(true);
        setError(null);

        try {
            const payload = {
                ...operationForm,
                type: operationForm.type || null,
                status: operationForm.status || null,
                date: operationForm.date || null,
            };

            const response = await fetch(
                `http://localhost:8080/projects/${code}/operations`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create operation: ${response.status}`);
            }

            setOpenOperationDialog(false);
            setOperationForm(emptyOperationForm);
            await fetchOperations();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setCreateOperationLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/projects/${code}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete project: ${response.status}`);
            }

            navigate('/projects'); // Redirect after successful deletion
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setOpenConfirmDialog(false);
        }
    };

    const handleUploadDocument = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!code) return;

        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(
                `http://localhost:8080/projects/${code}/files`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.status}`);
            }

            await fetchDocuments();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            event.target.value = '';
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
                <Stack spacing={3}>

                    <Stack
                        direction="row"
                        sx={{
                            mb: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h4" component="h1">
                            Project details
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon/>}
                            onClick={() => setOpenConfirmDialog(true)}
                            sx={{ ml: 'auto' }}
                        >
                            Delete
                        </Button>
                    </Stack>

                    {error && <Alert severity="error">{error}</Alert>}

                    {/* PROJECT DETAILS */}
                    <Paper sx={{p: 3, borderRadius: 3}}>
                        <Typography variant="h6" sx={{mb: 2}}>
                            Project details
                        </Typography>

                        {projectLoading ? (
                            <Typography color="text.secondary">Loading project...</Typography>
                        ) : !project ? (
                            <Typography color="text.secondary">Project not found.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                                    <TextField label="Code" value={project.code ?? ''} fullWidth slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}/>
                                    <TextField label="Name" value={project.name ?? ''} fullWidth slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}/>
                                    <TextField label="Status" value={project.status ?? ''} fullWidth slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}/>
                                </Stack>

                                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                                    <TextField
                                        label="Start date"
                                        value={project.startDate ?? ''}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                    <TextField
                                        label="End date"
                                        value={project.endDate ?? ''}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </Stack>

                                <TextField
                                    label="Description"
                                    value={project.description ?? ''}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />

                                <TextField
                                    label="Objective"
                                    value={project.objective ?? ''}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Stack>
                        )}
                    </Paper>

                    {/* DRONE OPERATIONS */}
                    <Paper sx={{p: 3, borderRadius: 3}}>
                        <Stack
                            direction="row"
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h6">Drone operations</Typography>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                onClick={handleOpenOperationDialog}
                                sx={{ ml: 'auto' }}
                            >
                                Add operation
                            </Button>
                        </Stack>

                        <Box sx={{height: 420, width: '100%'}}>
                            <DataGrid
                                rows={operationsRows}
                                columns={operationColumns}
                                getRowId={(row) => row.code}
                                loading={operationsLoading}
                                pagination
                                paginationMode="server"
                                rowCount={operationsRowCount}
                                pageSizeOptions={[5, 10, 20]}
                                paginationModel={operationsPaginationModel}
                                onPaginationModelChange={setOperationsPaginationModel}
                                disableRowSelectionOnClick
                                sx={{
                                    border: 0,
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'grey.100',
                                    },
                                }}
                            />
                        </Box>
                    </Paper>

                    {/* PROJECT DOCUMENTS */}
                    <Paper sx={{p: 3, borderRadius: 3}}>
                        <Stack
                            direction="row"
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h6">Project documents</Typography>

                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<UploadFileOutlinedIcon/>}
                                sx={{ ml: 'auto' }}
                            >
                                Upload file
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleUploadDocument}
                                />
                            </Button>
                        </Stack>

                        <Box sx={{height: 420, width: '100%'}}>
                            <DataGrid
                                rows={documentsRows}
                                columns={documentColumns}
                                getRowId={(row) => row.id}
                                loading={documentsLoading}
                                pagination
                                paginationMode="server"
                                rowCount={documentsRowCount}
                                pageSizeOptions={[5, 10, 20]}
                                paginationModel={documentsPaginationModel}
                                onPaginationModelChange={setDocumentsPaginationModel}
                                disableRowSelectionOnClick
                                sx={{
                                    border: 0,
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'grey.100',
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Stack>

                <Dialog
                    open={openOperationDialog}
                    onClose={handleCloseOperationDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Add new operation</DialogTitle>

                    <DialogContent>
                        <Stack spacing={2} sx={{mt: 1}}>
                            <TextField
                                label="Name"
                                value={operationForm.name}
                                onChange={handleOperationChange('name')}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Type"
                                value={operationForm.type}
                                onChange={handleOperationChange('type')}
                                fullWidth
                            />

                            <TextField
                                label="Status"
                                value={operationForm.status}
                                onChange={handleOperationChange('status')}
                                fullWidth
                            />

                            <TextField
                                label="Date"
                                type="date"
                                value={operationForm.date ?? ''}
                                onChange={handleOperationChange('date')}
                                fullWidth
                                slotProps={{
                                    inputLabel: {shrink: true},
                                }}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleCloseOperationDialog}
                            disabled={createOperationLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateOperation}
                            variant="contained"
                            disabled={createOperationLoading || !operationForm.name}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <ConfirmationDialog
                    open={openConfirmDialog}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    onConfirm={handleDeleteProject} // Perform deletion
                    onCancel={() => setOpenConfirmDialog(false)} // Close dialog
                    confirmLabel={'Delete'}
                    cancelLabel="Cancel"
                />
            </Box>
        </Box>
    );
}