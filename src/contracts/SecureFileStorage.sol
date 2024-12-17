/* source code for smart contract for reference
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureFileStorage {
    struct Metadata {
        string encryptedCID; // Encrypted IPFS CID
        address owner;       // Owner of the file
    }

    // Mapping of block IDs to metadata
    mapping(uint256 => Metadata) private metadataStore;

    // Mapping to track access permissions
    mapping(uint256 => mapping(address => bool)) private accessList;

    // Event to notify when metadata is stored
    event MetadataStored(uint256 indexed blockId, address indexed owner);
    
    // Modifier to restrict access
    modifier onlyOwner(uint256 blockId) {
        require(msg.sender == metadataStore[blockId].owner, "Not authorized");
        _;
    }

    // Store metadata
    function storeMetadata(uint256 blockId, string memory encryptedCID) external {
        require(metadataStore[blockId].owner == address(0), "Block ID already exists");

        metadataStore[blockId] = Metadata({
            encryptedCID: encryptedCID,
            owner: msg.sender
        });

        emit MetadataStored(blockId, msg.sender);
    }

    // Grant access to a user
    function grantAccess(uint256 blockId, address user) external onlyOwner(blockId) {
        accessList[blockId][user] = true;
    }

    // Revoke access from a user
    function revokeAccess(uint256 blockId, address user) external onlyOwner(blockId) {
        accessList[blockId][user] = false;
    }

    // Retrieve metadata (only for authorized users)
    function getMetadata(uint256 blockId) external view returns (string memory) {
        require(
            msg.sender == metadataStore[blockId].owner || accessList[blockId][msg.sender],
            "Access denied"
        );
        return metadataStore[blockId].encryptedCID;
    }
}
*/