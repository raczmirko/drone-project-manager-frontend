import { useCallback, useEffect, useState } from 'react';
import { operationApi } from '../api/operationApi';
import type {
    DroneOperation,
    UpdateDroneOperationRequest,
} from '../types/operationTypes';

export function useOperationDetails(projectCode: string, operationCode: string) {
    const [data, setData] = useState<DroneOperation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!projectCode || !operationCode) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await operationApi.get(projectCode, operationCode);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [projectCode, operationCode]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const updateOperation = useCallback(
        async (payload: UpdateDroneOperationRequest) => {
            if (!projectCode || !operationCode) {
                return false;
            }

            setUpdateLoading(true);
            setUpdateError(null);

            try {
                const updated = await operationApi.update(projectCode, operationCode, payload);
                setData(updated);
                return true;
            } catch (err) {
                setUpdateError(err instanceof Error ? err.message : 'Unknown error');
                return false;
            } finally {
                setUpdateLoading(false);
            }
        },
        [projectCode, operationCode],
    );

    const resetUpdateError = useCallback(() => {
        setUpdateError(null);
    }, []);

    return {
        data,
        loading,
        error,
        refetch,
        updateOperation,
        updateLoading,
        updateError,
        resetUpdateError,
    };
}