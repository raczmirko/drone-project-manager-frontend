import { Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type ProjectHeaderProps = {
    onDelete: () => void;
};

export default function ProjectHeader({ onDelete }: ProjectHeaderProps) {
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
                Project details
            </Typography>

            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                sx={{ ml: 'auto' }}
            >
                Delete
            </Button>
        </Stack>
    );
}
