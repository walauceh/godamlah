// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataAccess {
    struct Metadata {
        string ipfsHash; // Reference to off-chain data
        address owner;   // Owner of the metadata
    }

    mapping(uint256 => Metadata) public metadataRegistry; // Block ID to Metadata
    mapping(uint256 => mapping(address => bool)) public accessControl; // Block ID to User Access
    uint256 public currentId;

    // Event logs
    event MetadataAdded(uint256 indexed id, address indexed owner, string ipfsHash);
    event AccessGranted(uint256 indexed id, address indexed user);
    event AccessRevoked(uint256 indexed id, address indexed user);

    // Add metadata
    function addMetadata(string memory _ipfsHash) public {
        uint256 id = currentId++;
        metadataRegistry[id] = Metadata(_ipfsHash, msg.sender);
        accessControl[id][msg.sender] = true; // Owner has default access

        emit MetadataAdded(id, msg.sender, _ipfsHash);
    }

    // Grant access
    function grantAccess(uint256 _id, address _user) public {
        require(metadataRegistry[_id].owner == msg.sender, "Not the owner");
        accessControl[_id][_user] = true;

        emit AccessGranted(_id, _user);
    }

    // Revoke access
    function revokeAccess(uint256 _id, address _user) public {
        require(metadataRegistry[_id].owner == msg.sender, "Not the owner");
        accessControl[_id][_user] = false;

        emit AccessRevoked(_id, _user);
    }

    // Verify access
    function hasAccess(uint256 _id, address _user) public view returns (bool) {
        return accessControl[_id][_user];
    }
}