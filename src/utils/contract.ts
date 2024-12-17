import { BrowserProvider, ethers } from "ethers";
import CONTRACT_ABI from "../contracts/SecureFileStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/52a17c0ecc1c4ec7ba25cbd9a3a9a5ec';
const SEPOLIA_NETWORK_CONFIG = {
  chainId: '0xaa36a7', // 11155111 in hexadecimal
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
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
          params: [{ chainId: SEPOLIA_NETWORK_CONFIG.chainId }],
        });
      } catch (switchError: any) {
        // If network not added, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [SEPOLIA_NETWORK_CONFIG],
            });
          } catch (addError) {
            console.error('Failed to add Sepolia network:', addError);
            return null;
          }
        } else {
          console.error('Failed to switch to Sepolia network:', switchError);
          return null;
        }
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
