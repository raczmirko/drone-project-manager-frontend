import { useCallback, useState } from 'react';
import { projectApi } from '../api/projectApi';

type DownloadProjectFileParams = {
    projectCode: string;
    documentId: string;
    fileName: string;
};

export function useProjectFileDownload() {
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const downloadFile = useCallback(
        async ({ documentId, fileName }: DownloadProjectFileParams) => {
            setDownloadLoading(true);
            setDownloadError(null);

            try {
                const blob = await projectApi.downloadDocument(documentId);

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = fileName || 'download';

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
            } catch (err) {
                setDownloadError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setDownloadLoading(false);
            }
        },
        [],
    );

    const resetDownloadError = useCallback(() => {
        setDownloadError(null);
    }, []);

    return {
        downloadFile,
        downloadLoading,
        downloadError,
        resetDownloadError,
    };
}
