import React, {useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import {Button} from '@mui/material';
import {type Dayjs} from 'dayjs';
import {useTranslation} from 'react-i18next';
import ProjectDialog from '../components/ProjectDialog.tsx';
import type {Project, ProjectFormData, UpdateProjectRequest} from '../types/projectTypes.ts';

type EditProjectDialogContainerProps = {
    project: Project;
    updateLoading: boolean;
    updateError: string | null;
    onUpdateProject: (projectCode: string, payload: UpdateProjectRequest) => Promise<boolean>;
};

function mapProjectToFormData(project: Project): ProjectFormData {
    return {
        code: project.code ?? '',
        name: project.name ?? '',
        status: project.status ?? '',
        description: project.description ?? '',
        objective: project.objective ?? '',
        startDate: project.startDate ?? null,
        endDate: project.endDate ?? null,
    };
}

export default function EditProjectDialogContainer({
                                                       project,
                                                       updateLoading,
                                                       onUpdateProject,
                                                   }: EditProjectDialogContainerProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>(() => mapProjectToFormData(project));

    useEffect(() => {
        if (!open) {
            setFormData(mapProjectToFormData(project));
        }
    }, [project, open]);

    const handleChange =
        (field: keyof Omit<ProjectFormData, 'startDate' | 'endDate'>) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setFormData((previous) => ({
                    ...previous,
                    [field]: event.target.value,
                }));
            };

    const handleDateChange =
        (field: 'startDate' | 'endDate') =>
            (value: Dayjs | null) => {
                setFormData((previous) => ({
                    ...previous,
                    [field]: value ? value.format('YYYY-MM-DD') : null,
                }));
            };

    const handleSubmit = async () => {
        const success = await onUpdateProject(project.code, {
            name: formData.name,
            status: formData.status,
            description: formData.description,
            objective: formData.objective,
            startDate: formData.startDate,
            endDate: formData.endDate,
        });

        if (success) {
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setOpen(true)}
            >
                {t('general.actions.edit')}
            </Button>

            <ProjectDialog
                open={open}
                mode="edit"
                formData={formData}
                loading={updateLoading}
                codeReadOnly
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onDateChange={handleDateChange}
            />
        </>
    );
}