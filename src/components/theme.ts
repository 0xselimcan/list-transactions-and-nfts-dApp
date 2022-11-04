import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#009688",
    },
    secondary: {
      main: "#FF4081",
    },
    background: {
      default: "#232323",
      paper: "#353535",
    },
  },
});

export default theme;
