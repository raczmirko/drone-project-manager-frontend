import { useCallback, useEffect, useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { projectApi } from '../api/projectApi';
import type {
    CreateProjectFormValues,
    CreateProjectRequest,
    Project,
} from '../types/projectTypes';

const DEFAULT_PAGINATION_MODEL: GridPaginationModel = {
    page: 0,
    pageSize: 10,
};

export const EMPTY_PROJECT_FORM: CreateProjectFormValues = {
    code: '',
    name: '',
    status: '',
    description: '',
    objective: '',
    startDate: '',
    endDate: '',
};

function toCreateProjectRequest(
    values: CreateProjectFormValues,
): CreateProjectRequest {
    return {
        code: values.code.trim(),
        name: values.name.trim(),
        status: values.status.trim() || null,
        description: values.description.trim() || null,
        objective: values.objective.trim() || null,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
    };
}

export function useProjects() {
    const [rows, setRows] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] =
        useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL);

    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await projectApi.getProjects(
                paginationModel.page,
                paginationModel.pageSize,
            );
            setRows(response.content ?? []);
            setRowCount(response.totalElements ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setRows([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    }, [paginationModel.page, paginationModel.pageSize]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const createProject = useCallback(
        async (values: CreateProjectFormValues) => {
            setCreateLoading(true);
            setCreateError(null);

            try {
                await projectApi.createProject(toCreateProjectRequest(values));
                await refetch();
                return true;
            } catch (err) {
                setCreateError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setCreateLoading(false);
            }
        },
        [refetch],
    );

    const resetCreateError = useCallback(() => {
        setCreateError(null);
    }, []);

    return {
        rows,
        loading,
        error,
        rowCount,
        paginationModel,
        setPaginationModel,
        refetch,
        createProject,
        createLoading,
        createError,
        resetCreateError,
    };
}
