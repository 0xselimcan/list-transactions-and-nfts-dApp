import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Close } from "@mui/icons-material";

const NftItem = ({ nft }: { nft: any }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const RenderAsset = () => {
    if (nft?.meta?.content[0]?.animation) {
      return (
        <video autoPlay muted style={{ width: "100%", height: "auto" }}>
          <source src={nft?.meta?.animation} type="video/ogg" />
        </video>
      );
    } else if (nft?.meta?.content[0]?.url) {
      return (
        <img
          src={nft?.meta?.content[0]?.url || "/broken.png"}
          alt=""
          loading="lazy"
          onError={(e) => e.currentTarget.src = "/broken.png"}
          style={{ width: "100%", height: "auto" }}
        />
      );
    } else {
      return (
        <img
          src={"/broken.png"}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
        />
      );
    }
  };

  return (
    <>
      <ImageListItem
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
        cols={1}
        rows={1}
      >
        <RenderAsset />
      </ImageListItem>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Paper
          sx={{
            width: "80%",
            height: "80%",
            overflowY: "scroll",
          }}
        >
          <IconButton
            sx={{
              float: "right",
              backgroundColor: theme.palette.secondary.main,
              margin: theme.spacing(1),
            }}
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
          <Grid
            container
            minHeight={"90%"}
            alignItems={"center"}
            justifyContent={"space-around"}
          >
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RenderAsset />
            </Grid>
            <Grid item md={5}>
              <Typography>
                Name: <b>{nft?.meta?.name}</b>
              </Typography>
              <Typography>
                Description: <b>{nft?.meta?.description}</b>
              </Typography>
              {nft?.meta?.attributes && (
                <>
                  <Divider />
                  <Typography>
                    <b>Attributes</b>
                  </Typography>
                  {nft?.meta?.attributes.map((attribute: any, i: any) => (
                    <Typography key={i}>
                      {attribute?.key}: <b>{attribute?.value}</b>
                    </Typography>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

const ShowNftsPage = () => {
  const { address } = useOutletContext<{ address: string }>();
  const [nfts, setNfts] = useState<any>();

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(
          `https://api.rarible.org/v0.1/items/byOwner?owner=ETHEREUM:${address}`
        );
        if (res?.data) {
          console.log(res.data);
          setNfts(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => { };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {nfts?.items ? (
        <ImageList
          sx={{ width: "100%" }}
          variant="quilted"
          cols={4}
          rowHeight={300}
        >
          {nfts?.items.map((nft: any, i: any) => (
            <NftItem key={i} nft={nft} />
          ))}
        </ImageList>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
export default ShowNftsPage;
