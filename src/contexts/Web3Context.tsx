import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import Web3 from "web3";
import CarbonCreditsABI from "../abis/CarbonCredits.json"; // Adjust path to your ABI file

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  ethPrice: number;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  buyCredits: (amount: number, price: number) => Promise<boolean>;
  mintTokens: (projectId: string, amount: number) => Promise<boolean>;
  createProject: (name: string, location: string, projectType: string, totalSupply: number) => Promise<boolean>;
}

const defaultContext: Web3ContextType = {
  account: null,
  isConnected: false,
  balance: "0",
  ethPrice: 3200, // Default ETH price (update as needed)
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  buyCredits: async () => false,
  mintTokens: async () => false,
  createProject: async () => false,
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const { toast } = useToast();

  // Initialize Web3 and contract on mount
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(
        CarbonCreditsABI,
        "0x259dDba319FA5576Bc154AeB04faA8c1De4CdAEb" // Your deployed contract address
      );
      setContract(contractInstance);
    } else {
      console.log("MetaMask not detected");
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);

    if (!window.ethereum) {
      toast({
        title: "No Wallet Detected",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    if (!window.ethereum.isMetaMask) {
      toast({
        title: "MetaMask Required",
        description: "Please use MetaMask for wallet connection.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selectedAccount = accounts[0];
      if (!selectedAccount) {
        throw new Error("No account selected in MetaMask.");
      }

      setAccount(selectedAccount);

      const balanceWei = await web3Instance.eth.getBalance(selectedAccount);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
      setBalance(parseFloat(balanceEth).toFixed(4));

      const contractInstance = new web3Instance.eth.Contract(
        CarbonCreditsABI,
        "0x259dDba319FA5576Bc154AeB04faA8c1De4CdAEb"
      );
      setContract(contractInstance);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`,
      });

      window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnect();
        } else {
          setAccount(newAccounts[0]);
          updateBalance(newAccounts[0], web3Instance);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const updateBalance = async (account: string, web3Instance: Web3) => {
    const balanceWei = await web3Instance.eth.getBalance(account);
    const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
    setBalance(parseFloat(balanceEth).toFixed(4));
  };

  const disconnect = () => {
    setAccount(null);
    setBalance("0");
    setWeb3(null);
    setContract(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const buyCredits = async (amount: number, price: number): Promise<boolean> => {
    if (!account || !web3 || !contract) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      // For now, simulate buying by minting tokens (no payment logic in contract)
      // In a real scenario, you'd send ETH and call a payable function
      const totalCostWei = web3.utils.toWei((amount * price).toString(), "ether");
      await contract.methods.mint(0, amount).send({ from: account, value: totalCostWei }); // Adjust tokenId as needed
      toast({
        title: "Transaction Successful",
        description: `You've purchased ${amount} carbon credits for ${(price * amount).toFixed(4)} ETH`,
      });
      updateBalance(account, web3);
      return true;
    } catch (error: any) {
      console.error("Buy credits error:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Could not complete transaction. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const mintTokens = async (projectId: string, amount: number): Promise<boolean> => {
    if (!account || !web3 || !contract) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const tokenId = parseInt(projectId, 10); // Convert projectId to integer
      await contract.methods.mint(tokenId, amount).send({ from: account });
      toast({
        title: "Tokens Minted",
        description: `Successfully minted ${amount} carbon credit tokens for project ${projectId}`,
      });
      updateBalance(account, web3);
      return true;
    } catch (error: any) {
      console.error("Mint tokens error:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "Could not mint tokens. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const createProject = async (name: string, location: string, projectType: string, totalSupply: number): Promise<boolean> => {
    if (!account || !web3 || !contract) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      await contract.methods.createProject(name, location, projectType, totalSupply).send({ from: account });
      toast({
        title: "Project Created",
        description: `Successfully created project: ${name}`,
      });
      updateBalance(account, web3);
      return true;
    } catch (error: any) {
      console.error("Create project error:", error);
      toast({
        title: "Project Creation Failed",
        description: error.message || "Could not create project. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        balance,
        ethPrice: defaultContext.ethPrice,
        isConnecting,
        connect,
        disconnect,
        buyCredits,
        mintTokens,
        createProject,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};