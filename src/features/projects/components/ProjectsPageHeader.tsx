import {Button, Stack, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useTranslation} from "react-i18next";

type ProjectHeaderProps = {
    onAdd: () => void;
};

export default function ProjectsPageHeader({ onAdd }: ProjectHeaderProps) {
    const { t } = useTranslation();
    return (
        <Stack
            direction="row"
            sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    color: 'white',
                    fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}
            >
                {t('projects.title')}
            </Typography>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                sx={{
                    ml: 'auto',
                    whiteSpace: 'nowrap',
                    minWidth: { xs: 'auto', sm: '120px' }
                }}
            >
                {t('projects.crud.add')}
            </Button>
        </Stack>
    )
}