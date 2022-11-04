import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <Typography variant="h5">Not Found</Typography>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: theme.spacing(4) }}
        onClick={() => navigate("/")}
      >
        Go Back
      </Button>
    </Box>
  );
};
export default NotFoundPage;
