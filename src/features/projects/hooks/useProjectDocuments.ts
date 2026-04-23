import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { projectApi } from '../api/projectApi';
import type { ProjectDocument } from '../types/projectTypes';

const DEFAULT_PAGINATION_MODEL: GridPaginationModel = {
    page: 0,
    pageSize: 5,
};

export function useProjectDocuments(code: string) {
    const [rows, setRows] = useState<ProjectDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        DEFAULT_PAGINATION_MODEL,
    );
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!code) {
            setRows([]);
            setRowCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await projectApi.getDocuments(
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

    const uploadDocument = useCallback(
        async (file: File) => {
            if (!code) {
                return false;
            }

            setUploadLoading(true);
            setUploadError(null);

            try {
                await projectApi.uploadDocument(code, file);
                await refetch();
                return true;
            } catch (err) {
                setUploadError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setUploadLoading(false);
            }
        },
        [code, refetch],
    );

    const resetUploadError = useCallback(() => {
        setUploadError(null);
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
        ],
    );
}
