// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredits is ERC1155, Ownable {
    // Tracks the next available token ID for new projects
    uint256 public nextTokenId = 0;

    // Struct to store project details
    struct Project {
        string name;         // e.g., "Mangrove Restoration"
        string location;     // e.g., "Indonesia"
        string projectType;  // e.g., "Forestation"
        uint256 totalSupply; // Total credits available for this project
    }

    // Mapping from token ID to project details
    mapping(uint256 => Project) public projects;

    // Event emitted when a new project is created
    event ProjectCreated(uint256 tokenId, string name, string location, string projectType);
    // Event emitted when tokens are minted
    event TokensMinted(uint256 tokenId, uint256 amount, address recipient);

    // Constructor sets the base URI for metadata and initializes ownership
    constructor() ERC1155("https://your-metadata-url.com/{id}.json") Ownable(msg.sender) {}

    // Creates a new project and assigns a token ID
    function createProject(
        string memory name,
        string memory location,
        string memory projectType,
        uint256 totalSupply
    ) public onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(projectType).length > 0, "Project type cannot be empty");
        require(totalSupply > 0, "Total supply must be greater than zero");

        uint256 tokenId = nextTokenId;
        nextTokenId++;
        projects[tokenId] = Project(name, location, projectType, totalSupply);
        emit ProjectCreated(tokenId, name, location, projectType);
        return tokenId;
    }

    // Mints tokens for a specific project (token ID)
    function mint(uint256 tokenId, uint256 amount) public onlyOwner {
        require(projects[tokenId].totalSupply > 0, "Project does not exist");
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= projects[tokenId].totalSupply, "Amount exceeds project supply");

        projects[tokenId].totalSupply -= amount; // Reduce available supply
        _mint(msg.sender, tokenId, amount, "");
        emit TokensMinted(tokenId, amount, msg.sender);
    }
}