import { createTheme } from "@mui/material/styles";

const TransparentBackgroundTheme = createTheme({
    palette: {
        background: {
            default: "transparent", // Transparent background for the whole body
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "transparent", // Avoids default white color
                    minHeight: "100vh",
                    margin: 0,
                    overflow: "hidden", // Prevents scrolling artifacts
                },
            },
        },
    },
});

export default TransparentBackgroundTheme;