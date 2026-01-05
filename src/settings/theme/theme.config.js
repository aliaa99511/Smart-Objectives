import { createTheme } from "@mui/material/styles";
import { palette } from "./palette.theme";
import { typography } from "./typography.theme";
import { spacing } from "./spacing.theme";
import { components } from "./components.theme";
let muiTheme = createTheme({
  palette,
  typography,
  spacing,
  components,
  // Add other combined theme parts here
});

export default muiTheme;
