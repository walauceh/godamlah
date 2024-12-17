import { BrowserProvider, ethers } from "ethers";

// Replace with your contract's deployed address and ABI
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "blockId", "type": "uint256" },
      { "internalType": "string", "name": "encryptedCID", "type": "string" }
    ],
    "name": "storeMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "blockId", "type": "uint256" }],
    "name": "getMetadata",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "blockId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "blockId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address is not set");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
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
