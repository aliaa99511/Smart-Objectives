import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./router/AppRoutes";
import muiTheme from "./settings/theme/theme.config";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* css reset with matrial ui */}
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
