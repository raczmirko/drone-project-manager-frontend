import type {
    CreateOperationRequest, CreateProjectRequest,
    DroneOperation,
    PageResponse,
    Project,
    ProjectDocument,
} from '../types/projectTypes';

const API_BASE_URL = 'http://localhost:8080';

async function parseError(response: Response): Promise<string> {
    try {
        const text = await response.text();
        return text || `${response.status} ${response.statusText}`;
    } catch {
        return `${response.status} ${response.statusText}`;
    }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem('token');
    const isFormData = init?.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${token}`,
            ...init?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return await response.json() as Promise<T>;
}

async function apiFetchBlob(path: string, init?: RequestInit): Promise<Blob> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            ...init?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    return response.blob();
}

export const projectApi = {
    getProjects(page: number, size: number) {
        return apiFetch<PageResponse<Project>>(`/projects?page=${page}&size=${size}`);
    },

    createProject(payload: CreateProjectRequest) {
        return apiFetch<void>('/projects', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getByCode(code: string) {
        return apiFetch<Project>(`/projects/${code}`);
    },

    deleteByCode(code: string) {
        return apiFetch<void>(`/projects/${code}`, {
            method: 'DELETE',
        });
    },

    getOperations(code: string, page: number, size: number) {
        return apiFetch<PageResponse<DroneOperation>>(
            `/projects/${code}/operations?page=${page}&size=${size}`,
        );
    },

    createOperation(code: string, payload: CreateOperationRequest) {
        return apiFetch<void>(`/projects/${code}/operations`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getDocuments(code: string, page: number, size: number) {
        return apiFetch<PageResponse<ProjectDocument>>(
            `/projects/${code}/files?page=${page}&size=${size}`,
        );
    },

    uploadDocument(code: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return apiFetch<void>(`/projects/${code}/files`, {
            method: 'POST',
            body: formData,
        });
    },

    downloadProjectFile(documentId: string) {
        return apiFetchBlob(`/projects/files/${documentId}/download`, {
            method: 'GET',
        });
    }
};
