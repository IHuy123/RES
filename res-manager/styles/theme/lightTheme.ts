import { createTheme } from "@mui/material";
import { viVN } from "@mui/material/locale";
const lightTheme = createTheme(
    {
        palette: {
            mode: "light",
            primary: {
                main: "#7FB77E",
                contrastText: "#fff",
            },
        },
    },
    viVN
);

export default lightTheme;
