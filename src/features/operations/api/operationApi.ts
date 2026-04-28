import type {PageResponse, ProjectDocument} from "../../projects/types/projectTypes.ts";
import type {CreateLocationFormValues, LocationOption} from "../types/operationWizardTypes.ts";
import type {
    CreateDroneOperationRequest,
    DroneOperation,
    UpdateDroneOperationRequest
} from "../types/operationTypes.ts";
import type {
    OperationFlightAnalysisResponse,
    OperationImageMetadataExtractionResponse,
    OperationImageMetadataPageResponse,
} from '../types/operationImageMetadataTypes.ts';
import type {OperationFlightPathPoint} from "../types/operationAnalysisTypes.ts";

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
    const hasBody = init?.body != null;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
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

    const text = await response.text();

    if (!text.trim()) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
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

export const operationApi = {

    // -------------- OPERATION CRUD -----------------

    getAll(projectCode: string, page: number, size: number) {
        return apiFetch<PageResponse<DroneOperation>>(
            `/projects/${projectCode}/operations?page=${page}&size=${size}`,
        );
    },

    get(projectCode: string, operationCode: string) {
        return apiFetch<DroneOperation>(
            `/projects/${projectCode}/operations/${operationCode}`,
        );
    },

    update(projectCode: string, operationCode: string, payload: UpdateDroneOperationRequest) {
        return apiFetch<DroneOperation>(`/projects/${projectCode}/operations/${operationCode}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    deleteById(projectCode: string, operationCode: string) {
        return apiFetchBlob(`/projects/${projectCode}/operations/${operationCode}`, {
            method: 'DELETE',
        });
    },

    createOperation(projectCode: string, payload: CreateDroneOperationRequest) {
        return apiFetch<void>(`/projects/${projectCode}/operations`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    // -------------- OPERATION DOCUMENTS -----------------

    getDocuments(operationCode: string, page: number, size: number) {
        return apiFetch<PageResponse<ProjectDocument>>(
            `/operations/${operationCode}/files?page=${page}&size=${size}`,
        );
    },

    uploadDocument(operationCode: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return apiFetch<void>(`/operations/${operationCode}/files`, {
            method: 'POST',
            body: formData,
        });
    },

    downloadDocument(documentId: string) {
        return apiFetchBlob(`/operation-files/${documentId}`, {
            method: 'GET',
        });
    },

    deleteDocument(documentId: string) {
        return apiFetchBlob(`/operation-files/${documentId}`, {
            method: 'DELETE',
        });
    },

    // -------------- OPERATION IMAGE METADATA -----------------

    getImageMetadata(operationCode: string, page: number, size: number) {
        return apiFetch<OperationImageMetadataPageResponse>(
            `/operations/${operationCode}/image-metadata?page=${page}&size=${size}`,
        );
    },

    extractImageMetadata(operationCode: string, files: File[]) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        return apiFetch<OperationImageMetadataExtractionResponse>(
            `/operations/${operationCode}/image-metadata/extract`,
            {
                method: 'POST',
                body: formData,
            },
        );
    },

    analyzeImageMetadata(operationCode: string) {
        return apiFetch<OperationFlightAnalysisResponse>(
            `/operations/${operationCode}/image-metadata/analyze`,
            {
                method: 'POST',
            },
        );
    },

    getFlightPath(operationCode: string) {
        return apiFetch<OperationFlightPathPoint[]>(
            `/operations/${operationCode}/image-metadata/flight-path`,
        );
    },

    // -------------- LOCATIONS -----------------

    getLocations(page = 0, size = 50) {
        return apiFetch<PageResponse<LocationOption>>(`/locations?page=${page}&size=${size}`);
    },

    createLocation(payload: CreateLocationFormValues) {
        return apiFetch<LocationOption>('/locations', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};
