import { Alert, Stack, Typography } from '@mui/material';
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
    return (
        <SectionCard title="Project details">
            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            {loading ? (
                <Typography color="text.secondary">Loading project...</Typography>
            ) : !project ? (
                <Typography color="text.secondary">Project not found.</Typography>
            ) : (
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <ReadOnlyField label="Code" value={project.code} />
                        <ReadOnlyField label="Name" value={project.name} />
                        <ReadOnlyField label="Status" value={project.status} />
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <ReadOnlyField label="Start date" value={formatDate(project.startDate)} />
                        <ReadOnlyField label="End date" value={formatDate(project.endDate)} />
                    </Stack>

                    <ReadOnlyField
                        label="Description"
                        value={project.description}
                        multiline
                        minRows={3}
                    />

                    <ReadOnlyField
                        label="Objective"
                        value={project.objective}
                        multiline
                        minRows={3}
                    />
                </Stack>
            )}
        </SectionCard>
    );
}
