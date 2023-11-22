import { createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";
import { csCZ as materialCs } from "@mui/material/locale";
import { csCZ as dateCs } from "@mui/x-date-pickers/locales";

import useMediaQuery from "@mui/material/useMediaQuery";

const lightThemeTokens = {
    background: {
        default: colors.grey[100],
        paper: colors.common.white,
    },
    divider: "rgba(0, 0, 0, 0.42)",
}

const darkThemeTokens = {
    background: {
        default: colors.common.black,
        paper: colors.grey[900],
    },
    divider: "rgba(255, 255, 255, 0.7)",
    primary: {
        main: colors.blue[600],
    },
    info: {
        light: colors.blue[600], 
        main: colors.blue[600],
        dark:  colors.blue[600],
    }
}



export default function useThemeCreator() {

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    return createTheme(
        {
            palette: {
                mode: prefersDarkMode ? "dark" : "light",
                ...(prefersDarkMode ? darkThemeTokens : lightThemeTokens),
            },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 600,
                    md: 900,
                    lg: 1050,
                    xl: 1536,
                },
            }
        },
        materialCs,
        dateCs
    );

}
