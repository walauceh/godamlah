// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileRegistry {
    struct FileMetadata {
        string cid;        // IPFS CID of the file
        string name;       // File name
        string description; // Optional description
        address owner;     // Address of the file uploader
        uint256 timestamp; // Upload timestamp
    }

    mapping(uint256 => FileMetadata) public files; // Maps file ID to metadata
    uint256 public fileCount;                     // Tracks the total number of files

    event FileUploaded(
        uint256 indexed fileId,
        string cid,
        string name,
        string description,
        address indexed owner,
        uint256 timestamp
    );

    // Upload a file's metadata
    function uploadFile(
        string memory _cid,
        string memory _name,
        string memory _description
    ) public {
        fileCount += 1;
        files[fileCount] = FileMetadata({
            cid: _cid,
            name: _name,
            description: _description,
            owner: msg.sender,
            timestamp: block.timestamp
        });

        emit FileUploaded(fileCount, _cid, _name, _description, msg.sender, block.timestamp);
    }

    // Retrieve a file's metadata by ID
    function getFile(uint256 _fileId) public view returns (FileMetadata memory) {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        return files[_fileId];
    }
}
