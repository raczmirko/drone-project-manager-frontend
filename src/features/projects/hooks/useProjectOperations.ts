import {useCallback, useEffect, useState} from 'react';
import type {GridPaginationModel} from '@mui/x-data-grid';
import {operationApi} from '../../operations/api/operationApi.ts';
import type {
    CreateDroneOperationRequest,
    DroneOperation,
    UpdateDroneOperationRequest,
} from '../../operations/types/operationTypes.ts';

const DEFAULT_PAGINATION_MODEL: GridPaginationModel = {
    page: 0,
    pageSize: 5,
};

export function useProjectOperations(code: string) {
    const [rows, setRows] = useState<DroneOperation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        DEFAULT_PAGINATION_MODEL,
    );

    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!code) {
            setRows([]);
            setRowCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await operationApi.getAll(
                code,
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
    }, [code, paginationModel.page, paginationModel.pageSize]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const createOperation = useCallback(
        async (payload: CreateDroneOperationRequest) => {
            if (!code) {
                return false;
            }

            setCreateLoading(true);
            setCreateError(null);

            try {
                await operationApi.createOperation(code, payload);
                await refetch();
                return true;
            } catch (err) {
                setCreateError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setCreateLoading(false);
            }
        },
        [code, refetch],
    );

    const updateOperation = useCallback(
        async (operationCode: string, payload: UpdateDroneOperationRequest) => {
            if (!code || !operationCode) {
                return false;
            }

            setUpdateLoading(true);
            setUpdateError(null);

            try {
                await operationApi.update(code, operationCode, payload);
                await refetch();
                return true;
            } catch (err) {
                setUpdateError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setUpdateLoading(false);
            }
        },
        [code, refetch],
    );

    const resetCreateError = useCallback(() => {
        setCreateError(null);
    }, []);

    const resetUpdateError = useCallback(() => {
        setUpdateError(null);
    }, []);

    return {
        rows,
        loading,
        error,
        rowCount,
        paginationModel,
        setPaginationModel,
        refetch,
        createOperation,
        createLoading,
        createError,
        resetCreateError,
        updateOperation,
        updateLoading,
        updateError,
        resetUpdateError,
    };
}