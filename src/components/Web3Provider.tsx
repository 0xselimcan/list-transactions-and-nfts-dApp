import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import Web3Modal from "web3modal";
import { ethers, providers, Signer } from "ethers";
import {
  InfuraProvider,
  Web3Provider as EthersWeb3Provider,
  Network,
} from "@ethersproject/providers";

interface Props {
  network: "mainnet" | "ropsten" | "kovan" | "rinkeby" | "goerli";
  theme: "dark" | "light";
  children: ReactChild | ReactChild[];
}

export interface IWeb3Context {
  connected: Boolean;
  connect: any;
  web3Provider: EthersWeb3Provider | InfuraProvider;
  signer: Signer | undefined;
  account: string | undefined;
  network: Network | undefined;
}

const Web3Context = createContext<IWeb3Context>({
  connected: false,
  connect: () => false,
  web3Provider: new ethers.providers.InfuraProvider(
    "mainnet",
    process.env.REACT_APP_INFURA_ID
  ),
  signer: undefined,
  account: undefined,
  network: undefined,
});

export const useWeb3 = (): IWeb3Context => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error(`Cannot use the Web3 Context`);
  }
  return context;
};
const Web3Provider = ({
  network = "mainnet",
  theme = "light",
  children,
}: Props) => {
  const [connected, setConnected] = useState(false);
  const [web3Provider, setWeb3Provider] = useState<
    EthersWeb3Provider | InfuraProvider
  >(new ethers.providers.InfuraProvider(network, process.env.REACT_APP_INFURA_ID));
  const [signer, setSigner] = useState<Signer>();
  const [account, setAccount] = useState<string>();
  const [chain, setChain] = useState<Network>();

  useEffect(() => {
    if (connected) {
      web3Provider.on("network", (network: Network, oldNetwork) => {
        setChain(network);
      });
    }
    return () => {
      try {
        web3Provider.off("network");
      } catch (error) {
        console.log(error);
      }
    };
  }, [connected]);

  const connect = async () => {
    try {
      if (typeof window !== "undefined") {
        const web3Modal = new Web3Modal({
          network: network,
          theme: theme,
          cacheProvider: false,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: process.env.REACT_APP_INFURA_ID,
              },
            },
          },
        });

        web3Modal.clearCachedProvider();
        const provider = await web3Modal.connect();
        const web3Provider = new providers.Web3Provider(provider, "any");
        const signer = web3Provider.getSigner();
        const accounts = await web3Provider.listAccounts();

        setSigner(signer);
        setAccount(accounts[0]);
        setWeb3Provider(web3Provider);
        setConnected(true);
      }
    } catch (error) {
      setConnected(false);
      setAccount(undefined);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connected,
        connect,
        web3Provider,
        signer,
        account,
        network: chain,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
