import { ethers } from "ethers";
import FileRegistryABI from "../contracts/FileRegistry.json"; // Replace with your ABI

const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";

export const getBlockchainContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FileRegistryABI, signer);
};

export const uploadMetadata = async (
  cid: string,
  name: string,
  description: string
) => {
  const contract = await getBlockchainContract();
  const tx = await contract.uploadFile(cid, name, description);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("File metadata uploaded to blockchain.");
};
