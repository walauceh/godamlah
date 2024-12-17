import { BrowserProvider, ethers } from "ethers";
import CONTRACT_ABI from "../contracts/SecureFileStorage.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address is not set");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
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
