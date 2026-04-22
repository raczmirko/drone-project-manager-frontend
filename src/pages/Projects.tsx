import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from '@mui/x-data-grid';

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

export default function Projects() {
    const [rows, setRows] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const [rowCount, setRowCount] = useState(0);

    const columns = useMemo<GridColDef<Project>[]>(
        () => [
            {
                field: 'code',
                headerName: 'Code',
                flex: 1,
                minWidth: 130,
            },
            {
                field: 'name',
                headerName: 'Name',
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'status',
                headerName: 'Status',
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'startDate',
                headerName: 'Start date',
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
            },
            {
                field: 'endDate',
                headerName: 'End date',
                flex: 1,
                minWidth: 130,
                valueGetter: (value) => value ?? '-',
            },
        ],
        []
    );

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:8080/projects?page=${paginationModel.page}&size=${paginationModel.pageSize}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
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
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [paginationModel]);

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
                <Typography variant="h4" component="h4" sx={{ mb: 2 }}>
                    Projects
                </Typography>

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
            </Box>
        </Box>
    );
}