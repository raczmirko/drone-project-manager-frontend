import {useCallback, useEffect, useState} from 'react';
import type {CreateLocationFormValues, LocationOption} from '../../operations/types/operationWizardTypes.ts';
import {operationApi} from "../../operations/api/operationApi.ts";

export function useLocations() {
    const [rows, setRows] = useState<LocationOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await operationApi.getLocations();
            setRows(response.content ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const createLocation = useCallback(async (values: CreateLocationFormValues) => {
        setCreateLoading(true);
        setCreateError(null);

        try {
            const created = await operationApi.createLocation({
                name: values.name.trim(),
                latitude: values.latitude.trim(),
                longitude: values.longitude.trim(),
            });

            setRows((previous) => {
                const alreadyExists = previous.some((location) => location.id === created.id);
                return alreadyExists ? previous : [created, ...previous];
            });

            return created;
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setCreateLoading(false);
        }
    }, []);

    const resetCreateError = useCallback(() => {
        setCreateError(null);
    }, []);

    return {
        rows,
        loading,
        error,
        refetch,
        createLocation,
        createLoading,
        createError,
        resetCreateError,
    };
}
