import { useWeb3 } from "./Web3Provider";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Outlet,
  useParams,
  useResolvedPath,
  useMatch,
  Link,
  useNavigate,
} from "react-router-dom";
import { ResetTv } from "@mui/icons-material";

const ButtonLink = ({ children, to, ...props }: any) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname });

  return (
    <Button
      variant={match ? "contained" : "outlined"}
      LinkComponent={Link}
      to={to}
      {...props}
    >
      {children}
    </Button>
  );
};

const ProfileLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { address } = useParams();
  const { web3Provider } = useWeb3();

  const [targetAccount, setTargetAccount] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!address) {
        return;
      }
      try {
        let targetAccount = address;

        if (address?.endsWith(".eth")) {
          const resolved = await web3Provider.resolveName(address);
          if (resolved) {
            targetAccount = resolved;
          }
        }
        if (utils.isAddress(targetAccount)) {
          setTargetAccount(targetAccount);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {};
  }, []);

  if (!targetAccount) return <></>;

  return (
    <Grid
      container
      component={Container}
      flexDirection={"column"}
      alignItems={"center"}
      sx={{
        marginTop: theme.spacing(8),
      }}
    >
      <Grid item>
        <Button
          onClick={() => navigate("/")}
          color="secondary"
          endIcon={<ResetTv />}
        >
          Go Back
        </Button>
        <Typography variant="h5">{targetAccount}</Typography>
      </Grid>
      <Grid item sx={{ marginTop: theme.spacing(4) }}>
        <ButtonGroup>
          <ButtonLink to="tx">Transactions</ButtonLink>
          <ButtonLink to="nft">Nft's</ButtonLink>
        </ButtonGroup>
      </Grid>
      <Grid item sx={{ marginTop: theme.spacing(4), width: "100%" }}>
        <Outlet
          context={{
            address: targetAccount,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ProfileLayout;
