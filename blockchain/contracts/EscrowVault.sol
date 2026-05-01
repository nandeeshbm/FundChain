// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EscrowVault is Ownable, ReentrancyGuard {
    struct Project {
        uint256 totalBudget;
        uint256 releasedAmount;
        address contractor;
        bool exists;
    }

    mapping(string => Project) public projects;

    event ProjectCreated(string projectId, uint256 budget, address contractor);
    event FundsReleased(string projectId, uint256 amount, address contractor);

    constructor() Ownable(msg.sender) {}

    function createProject(string memory _projectId, address _contractor) external payable onlyOwner {
        require(!projects[_projectId].exists, "Project already exists");
        require(msg.value > 0, "Budget must be greater than 0");

        projects[_projectId] = Project({
            totalBudget: msg.value,
            releasedAmount: 0,
            contractor: _contractor,
            exists: true
        });

        emit ProjectCreated(_projectId, msg.value, _contractor);
    }

    function releaseFunds(string memory _projectId, uint256 _amount) external onlyOwner nonReentrant {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(project.releasedAmount + _amount <= project.totalBudget, "Exceeds total budget");

        project.releasedAmount += _amount;
        
        (bool success, ) = payable(project.contractor).call{value: _amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(_projectId, _amount, project.contractor);
    }

    function getProjectBalance(string memory _projectId) external view returns (uint256) {
        require(projects[_projectId].exists, "Project does not exist");
        return projects[_projectId].totalBudget - projects[_projectId].releasedAmount;
    }

    receive() external payable {}
}
