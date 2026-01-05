import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./mainLoader.module.css";

const MainLoader = ({ height = "100vh" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress className={styles.mainLoader} />
    </Box>
  );
};

export default MainLoader;
