import {Button, Stack, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useTranslation} from 'react-i18next';

type OperationDetailsPageHeaderProps = {
    onDelete: () => void; // Ensure it accepts a function
    // Add other props if necessary
};

export default function OperationDetailsPageHeader({ onDelete }: OperationDetailsPageHeaderProps) {
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
            <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
                {t('operations.details.title')}
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
