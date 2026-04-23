import { useCallback, useEffect, useState } from 'react';
import { projectApi } from '../api/projectApi';
import type { Project } from '../types/projectTypes';

export function useProjectDetails(code: string) {
    const [data, setData] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!code) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await projectApi.getByCode(code);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [code]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return {
        data,
        loading,
        error,
        refetch,
    };
}
