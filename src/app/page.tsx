"use client";

import ChatbotPage from "./Chatbotpage"; // Ensure the file name and import match
import { useState } from "react";
//import { addMetadata, grantAccess, hasAccess } from "../utils/blockchain";

export default function Chatbot() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [metadataId, setMetadataId] = useState(0);
  const [accessCheck, setAccessCheck] = useState<boolean | null>(null);

  // const handleAddMetadata = async () => {
  //   try {
  //     await addMetadata(ipfsHash);
  //     alert("Metadata added successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to add metadata.");
  //   }
  // };

  // const handleGrantAccess = async () => {
  //   try {
  //     await grantAccess(metadataId, userAddress);
  //     alert("Access granted successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to grant access.");
  //   }
  // };

  // const handleCheckAccess = async () => {
  //   try {
  //     const hasAccessFlag = await hasAccess(metadataId, userAddress);
  //     setAccessCheck(hasAccessFlag);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to check access.");
  //   }
  // };

  return (
    <ChatbotPage /> // Use uppercase for the component
  );
}