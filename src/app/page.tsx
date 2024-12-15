"use client";

import { useState } from "react";
import { addMetadata, grantAccess, hasAccess } from "../utils/blockchain";

export default function Home() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [metadataId, setMetadataId] = useState(0);
  const [accessCheck, setAccessCheck] = useState<boolean | null>(null);

  const handleAddMetadata = async () => {
    try {
      await addMetadata(ipfsHash);
      alert("Metadata added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add metadata.");
    }
  };

  const handleGrantAccess = async () => {
    try {
      await grantAccess(metadataId, userAddress);
      alert("Access granted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to grant access.");
    }
  };

  const handleCheckAccess = async () => {
    try {
      const hasAccessFlag = await hasAccess(metadataId, userAddress);
      setAccessCheck(hasAccessFlag);
    } catch (err) {
      console.error(err);
      alert("Failed to check access.");
    }
  };

  return (
    <div>
      <h1>Metadata Access Control</h1>
      <div>
        <h2>Add Metadata</h2>
        <input
          type="text"
          placeholder="IPFS Hash"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
        />
        <button onClick={handleAddMetadata}>Add Metadata</button>
      </div>

      <div>
        <h2>Grant Access</h2>
        <input
          type="number"
          placeholder="Metadata ID"
          value={metadataId}
          onChange={(e) => setMetadataId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="User Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button onClick={handleGrantAccess}>Grant Access</button>
      </div>

      <div>
        <h2>Check Access</h2>
        <input
          type="number"
          placeholder="Metadata ID"
          value={metadataId}
          onChange={(e) => setMetadataId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="User Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button onClick={handleCheckAccess}>Check Access</button>
        {accessCheck !== null && (
          <p>Access: {accessCheck ? "Granted" : "Denied"}</p>
        )}
      </div>
    </div>
  );
}
