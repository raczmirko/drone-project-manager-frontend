import { Alert, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReadOnlyField from './ReadOnlyField';
import SectionCard from './SectionCard';
import type { Project } from '../types/projectTypes';
import { formatDate } from '../utils/projectFormatters';

type ProjectSummaryCardProps = {
    project: Project | null;
    loading: boolean;
    error?: string | null;
};

export default function ProjectSummaryCard({
                                               project,
                                               loading,
                                               error,
                                           }: ProjectSummaryCardProps) {
    const { t } = useTranslation();
    return (
        <SectionCard title={t('projects.details.title')}>
            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            {loading ? (
                <Typography color="text.secondary">{t('projects.details.loading')}</Typography>
            ) : !project ? (
                <Typography color="text.secondary">{t('projects.details.notFound')}</Typography>
            ) : (
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <ReadOnlyField label={t('projects.fields.code')} value={project.code} />
                        <ReadOnlyField label={t('projects.fields.name')} value={project.name} />
                        <ReadOnlyField label={t('projects.fields.status')} value={project.status} />
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <ReadOnlyField label={t('projects.fields.startDate')} value={formatDate(project.startDate)} />
                        <ReadOnlyField label={t('projects.fields.endDate')} value={formatDate(project.endDate)} />
                    </Stack>

                    <ReadOnlyField
                        label={t('projects.fields.description')}
                        value={project.description}
                        multiline
                        minRows={3}
                    />

                    <ReadOnlyField
                        label={t('projects.fields.objective')}
                        value={project.objective}
                        multiline
                        minRows={3}
                    />
                </Stack>
            )}
        </SectionCard>
    );
}
