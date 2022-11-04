import ReactDOM from "react-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./components/theme";
import Web3Provider from "./components/Web3Provider";
import App from "./App";


ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Web3Provider network="mainnet" theme={theme.palette.mode}>
      <App />
    </Web3Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
