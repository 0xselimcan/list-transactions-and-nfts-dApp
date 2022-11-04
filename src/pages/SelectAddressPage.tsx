import {
  Alert,
  Button,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useWeb3 } from "../components/Web3Provider";
import { utils } from "ethers";
import { AccountBalanceWallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SelectAddressPage = () => {
  const theme = useTheme();
  let navigate = useNavigate();

  const { account, connect, connected, network, web3Provider } = useWeb3();

  const [address, setAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);

  useEffect(() => {
    if (account) {
      setAddress(account);
    }

    return () => {};
  }, [account]);

  useEffect(() => {
    (async () => {
      if (utils.isAddress(address)) {
        setIsAddressValid(true);
      } else if (address.endsWith(".eth")) {
        const ensAddress = await web3Provider.resolveName(address);
        if (ensAddress) {
          setIsAddressValid(true);
        } else {
          setIsAddressValid(false);
        }
      } else {
        setIsAddressValid(false);
      }
    })();
    return () => {};
  }, [address]);

  const handleSubmit = async (
    event: FormEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!isAddressValid || address === "") {
      return;
    }
    navigate(`/profile/${address}/tx`);
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Grid item xs={10} md={5} component={"form"} onSubmit={handleSubmit}>
        {connected && network?.chainId !== 1 && (
          <Alert severity="error" sx={{ width: "100%" }}>
            Please Connect To Ethereum Mainnet!
          </Alert>
        )}
        <TextField
          sx={{ marginTop: theme.spacing(4) }}
          fullWidth
          variant="outlined"
          label="Address or ENS name"
          value={address}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAddress(event.target.value)
          }
          helperText={
            isAddressValid || address === "" ? undefined : (
              <Typography variant="body2" component={"span"} color="secondary">
                Address is not valid
              </Typography>
            )
          }
          InputProps={{
            endAdornment:
              window.innerWidth <= theme.breakpoints.values.md ? (
                <Tooltip title="Connect Your Wallet" arrow>
                  <IconButton onClick={connect}>
                    <AccountBalanceWallet />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ minWidth: "40%" }}
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              ),
          }}
        />
        <Button
          sx={{ marginTop: theme.spacing(4) }}
          fullWidth
          variant="contained"
          disabled={!isAddressValid || address === ""}
          onClick={handleSubmit}
        >
          Go
        </Button>
      </Grid>
    </Grid>
  );
};

export default SelectAddressPage;
