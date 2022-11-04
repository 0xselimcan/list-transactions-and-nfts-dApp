import { useEffect, useState } from "react";
import etherscanApi from "../components/etherscanApi";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { utils, BigNumber } from "ethers";

const TransactionsTable = ({ rows }: { rows: any[] }) => {
  if (!rows || rows.length <= 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tx Hash</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.hash}>
              <TableCell component="th" scope="row">
                <a
                  target={"_blank"}
                  style={{ color: "inherit" }}
                  href={`https://etherscan.io/tx/${row.hash}`}
                >
                  {String(row.hash).substring(0, 12)}...
                </a>
              </TableCell>
              <TableCell align="right">
                <a
                  target={"_blank"}
                  style={{ color: "inherit" }}
                  href={`https://etherscan.io/address/${row.from}`}
                >
                  {String(row.from).substring(0, 12)}...
                </a>
              </TableCell>
              <TableCell align="right">
                <a
                  target={"_blank"}
                  style={{ color: "inherit" }}
                  href={`https://etherscan.io/address/${
                    row.to || row.contractAddress
                  }`}
                >
                  {String(row.to || row.contractAddress).substring(0, 12)}...
                </a>
              </TableCell>
              <TableCell align="right">
                <b>{utils.formatEther(row.value).toString().substring(0, 6)}</b>{" "}
                ETH
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ShowTransactionsPage = () => {
  const { address } = useOutletContext<{ address: string }>();
  const theme = useTheme();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [gasUsed, setGasUsed] = useState(BigNumber.from(0));
  const [totalFee, setTotalFee] = useState(BigNumber.from(0));

  useEffect(() => {
    if (transactions.length > 0) {
      let gasUsed = BigNumber.from(0);
      let totalFee = BigNumber.from(0);
      for (const tx of transactions) {
        gasUsed = gasUsed.add(tx.gasUsed);
        totalFee = totalFee.add(BigNumber.from(tx.gasUsed).mul(tx.gasPrice));
        setTotalFee(totalFee);
        setGasUsed(gasUsed);
      }
    }
    return () => {};
  }, [transactions]);

  useEffect(() => {
    (async () => {
      try {
        const txlist = await etherscanApi.account.txlist(
          address,
          1,
          "latest",
          1,
          10000,
          "asc"
        );
        console.log(txlist);
        if (txlist?.message === "OK" && txlist?.result) {
          setTransactions(txlist?.result);
        }
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {};
  }, []);

  return (
    <Box>
      {transactions && transactions.length > 0 && (
        <Box>
          <Typography>
            Total Gas Used: <b>{gasUsed.toString()}</b>
          </Typography>
          <Typography>
            Total Fee:{" "}
            <b>{utils.formatEther(totalFee.toString()).toString()} ETH</b>
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          marginTop: theme.spacing(4),
        }}
      >
        <TransactionsTable rows={transactions} />
      </Box>
    </Box>
  );
};

export default ShowTransactionsPage;
