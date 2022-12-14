import React from "react";
import { Typography, useTheme, Box } from "@mui/material";
import Link from "@mui/material/Link";

function Copyright() {
    return (
        <Typography variant="body2" color="currentcolor">
            {"Made by "}
            <Link color="inherit" href="https://material-ui.com/">
                Huy Team
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}
export const Footer = () => {
    const theme = useTheme();
    return (
        <footer
            style={{
                padding: theme.spacing(1, 0, 1, 0),
                marginTop: "auto",
                zIndex: theme.zIndex.drawer,
                backgroundColor: "rgba(0, 0, 0, 0.05)",
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                rowGap={1}
                sx={{
                    textAlign: "center",
                }}
            >
                <Typography variant="body1">Restaurant Management</Typography>
                <Copyright />
            </Box>
        </footer>
    );
};
