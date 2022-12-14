import { Box, CssBaseline, SxProps, Theme, Toolbar } from "@mui/material";
import AppBarWithDrawer from "components/AppBar";
import DrawerBase from "components/Drawer";
import { Footer } from "components/Footer";
import React from "react";

const drawerWidth = 250;
const appbarHeight = 70;

const DefaultLayout: React.FC<{ sx?: SxProps<Theme>; children?: React.ReactNode }> = ({
    children,
}) => {
    const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#f8f9fc",
            }}
        >
            <CssBaseline />
            <AppBarWithDrawer appbarHeight={appbarHeight} handleDrawerToggle={handleDrawerToggle} />
            <DrawerBase
                drawerWidth={drawerWidth}
                appbarHeight={appbarHeight}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ width: "100%" }}>{children}</Box>
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default DefaultLayout;
