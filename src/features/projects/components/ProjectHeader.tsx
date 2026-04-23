import { Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

type ProjectHeaderProps = {
    onDelete: () => void;
};

export default function ProjectHeader({ onDelete }: ProjectHeaderProps) {
    const { t } = useTranslation();
    return (
        <Stack
            direction="row"
            sx={{
                mb: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Typography variant="h4" component="h1">
                {t('projects.details.title')}
            </Typography>

            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                sx={{ ml: 'auto' }}
            >
                {t('general.actions.delete')}
            </Button>
        </Stack>
    );
}
