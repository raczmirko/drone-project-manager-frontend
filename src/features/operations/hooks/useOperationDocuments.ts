import {useCallback, useEffect, useMemo, useState} from 'react';
import type {GridPaginationModel} from '@mui/x-data-grid';
import {operationApi} from '../api/operationApi';
import type {OperationDocument} from '../types/operationTypes';

const DEFAULT_PAGINATION_MODEL: GridPaginationModel = {
    page: 0,
    pageSize: 5,
};

export function useOperationDocuments(projectCode: string, operationCode: string) {
    const [rows, setRows] = useState<OperationDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        DEFAULT_PAGINATION_MODEL,
    );

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!projectCode || !operationCode) {
            setRows([]);
            setRowCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await operationApi.getDocuments(
                operationCode,
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
    }, [projectCode, operationCode, paginationModel.page, paginationModel.pageSize]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const uploadDocument = useCallback(
        async (file: File) => {
            if (!projectCode || !operationCode) {
                return false;
            }

            setUploadLoading(true);
            setUploadError(null);

            try {
                await operationApi.uploadDocument(operationCode, file);
                await refetch();
                return true;
            } catch (err) {
                setUploadError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setUploadLoading(false);
            }
        },
        [projectCode, operationCode, refetch],
    );

    const deleteDocument = useCallback(
        async (documentId: string) => {
            if (!projectCode || !operationCode) {
                return false;
            }

            setDeleteLoading(true);
            setDeleteError(null);

            try {
                await operationApi.deleteDocument(documentId);
                await refetch();
                return true;
            } catch (err) {
                setDeleteError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setDeleteLoading(false);
            }
        },
        [projectCode, operationCode, refetch],
    );

    const resetUploadError = useCallback(() => {
        setUploadError(null);
    }, []);

    const resetDeleteError = useCallback(() => {
        setDeleteError(null);
    }, []);

    return useMemo(
        () => ({
            rows,
            loading,
            error,
            rowCount,
            paginationModel,
            setPaginationModel,
            refetch,
            uploadDocument,
            uploadLoading,
            uploadError,
            resetUploadError,
            deleteDocument,
            deleteLoading,
            deleteError,
            resetDeleteError,
        }),
        [
            rows,
            loading,
            error,
            rowCount,
            paginationModel,
            refetch,
            uploadDocument,
            uploadLoading,
            uploadError,
            resetUploadError,
            deleteDocument,
            deleteLoading,
            deleteError,
            resetDeleteError,
        ],
    );
}