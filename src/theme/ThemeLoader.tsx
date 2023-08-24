import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import useThemeCreator from "./useThemeCreator";


export default function ThemeLoader(props: {
    children?: React.ReactNode | undefined,
}) {

    const theme = useThemeCreator();
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {props.children}
        </ThemeProvider>
    )

}