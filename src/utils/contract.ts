import { BrowserProvider, ethers } from "ethers";
import CONTRACT_ABI from "../contracts/SecureFileStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const PRIVATE_RPC_URL = 'http://127.0.0.1:8545';
const PRIVATE_NETWORK_CONFIG = {
  chainId: '0x3039', // 12345 in hexadecimal
  chainName: 'Private Ethereum Chain',
  nativeCurrency: {
    name: 'Private ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: [PRIVATE_RPC_URL],
  blockExplorerUrls: []
};

export async function connectWallet(): Promise<BrowserProvider | null> {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new BrowserProvider(window.ethereum);

      try {
        // Attempt to switch to Sepolia network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: PRIVATE_NETWORK_CONFIG.chainId }],
        });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }

      return provider;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return null;
    }
  } else {
    console.error('MetaMask is not installed');
    return null;
  }
}

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address is not set");
  }

  // Connect wallet and get provider
  const provider = await connectWallet();
  if (!provider) {
    throw new Error("Failed to connect wallet");
  }

  const signer = await provider.getSigner();
  
  // Verify network
  const network = await provider.getNetwork();
  console.log('Current Network:', {
    chainId: network.chainId.toString(),
    name: network.name
  });

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Interact with the smart contract
export const storeMetadata = async (blockId: number, encryptedCID: string) => {
  const contract = await getContract();
  const tx = await contract.storeMetadata(blockId, encryptedCID);
  await tx.wait(); // Wait for transaction confirmation
  console.log("Metadata stored:", tx);
};

export const getMetadata = async (blockId: number) => {
  const contract = await getContract();
  const metadata = await contract.getMetadata(blockId);
  console.log("Retrieved metadata:", metadata);
  return metadata;
};

export const grantAccess = async (blockId: number, userAddress: string) => {
  const contract = await getContract();
  const tx = await contract.grantAccess(blockId, userAddress);
  await tx.wait();
  console.log(`Access granted to ${userAddress} for block ${blockId}`);
};

export const revokeAccess = async (blockId: number, userAddress: string) => {
  const contract = await getContract();
  const tx = await contract.revokeAccess(blockId, userAddress);
  await tx.wait();
  console.log(`Access revoked for ${userAddress} from block ${blockId}`);
};
