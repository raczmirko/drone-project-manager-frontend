export type Project = {
    id: string;
    code: string;
    name: string;
    status: string | null;
    description: string | null;
    objective: string | null;
    startDate: string | null;
    endDate: string | null;
};

export type DroneOperation = {
    id: string;
    code: string;
    name: string;
    type: string | null;
    status: string | null;
    date: string | null;
};

export type ProjectDocument = {
    id: string;
    fileName: string;
    type: string | null;
    uploadedAt: string | null;
    size: string | null;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages?: number;
    size?: number;
    number?: number;
};

export type CreateOperationRequest = {
    name: string;
    type: string | null;
    status: string | null;
    date: string | null;
};

export type CreateOperationFormValues = {
    name: string;
    type: string;
    status: string;
    date: string;
};

export type CreateProjectRequest = {
    code: string;
    name: string;
    status: string | null;
    description: string | null;
    objective: string | null;
    startDate: string | null;
    endDate: string | null;
};

export type CreateProjectFormValues = {
    code: string;
    name: string;
    status: string;
    description: string;
    objective: string;
    startDate: string;
    endDate: string;
};
