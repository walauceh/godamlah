import { ethers } from "ethers";
import contract from "../contracts/metadataContracts.json";

const CONTRACT_ADDRESS = contract.address;
const CONTRACT_ABI = contract.abi;

// Connect to the contract
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask.");
  }

  // Request user to connect MetaMask if not already connected
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Example functions
export const addMetadata = async (ipfsHash: string) => {
  const contract = await getContract();
  const tx = await contract.addMetadata(ipfsHash);
  await tx.wait(); // Wait for the transaction to be mined
};

export const grantAccess = async (id: number, user: string) => {
  const contract = await getContract();
  const tx = await contract.grantAccess(id, user);
  await tx.wait();
};

export const hasAccess = async (id: number, user: string): Promise<boolean> => {
  const contract = await getContract();
  return await contract.hasAccess(id, user);
};
