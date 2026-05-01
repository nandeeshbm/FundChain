// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EscrowVault is Ownable, ReentrancyGuard {
    struct Milestone {
        uint256 amount;
        bool isReleased;
        string proofHash; // IPFS CID of proof
    }

    struct Project {
        uint256 totalBudget;
        uint256 releasedAmount;
        address contractor;
        bool exists;
        bool isFrozen;
        uint256 milestoneCount;
        mapping(uint256 => Milestone) milestones;
    }

    mapping(string => Project) public projects;

    event ProjectCreated(string projectId, uint256 budget, address contractor, uint256 milestoneCount);
    event FundsReleased(string projectId, uint256 milestoneIndex, uint256 amount, address contractor);
    event ProjectFrozen(string projectId, bool frozen);

    constructor() {}

    function createProject(
        string memory _projectId, 
        address _contractor, 
        uint256[] memory _milestoneAmounts
    ) external payable onlyOwner {
        require(!projects[_projectId].exists, "Project already exists");
        require(msg.value > 0, "Budget must be greater than 0");
        
        uint256 totalMilestonesAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            totalMilestonesAmount += _milestoneAmounts[i];
        }
        require(totalMilestonesAmount == msg.value, "Milestones must equal budget");

        Project storage newProject = projects[_projectId];
        newProject.totalBudget = msg.value;
        newProject.releasedAmount = 0;
        newProject.contractor = _contractor;
        newProject.exists = true;
        newProject.isFrozen = false;
        newProject.milestoneCount = _milestoneAmounts.length;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            newProject.milestones[i] = Milestone({
                amount: _milestoneAmounts[i],
                isReleased: false,
                proofHash: ""
            });
        }

        emit ProjectCreated(_projectId, msg.value, _contractor, _milestoneAmounts.length);
    }

    function freezeProject(string memory _projectId, bool _frozen) external onlyOwner {
        require(projects[_projectId].exists, "Project does not exist");
        projects[_projectId].isFrozen = _frozen;
        emit ProjectFrozen(_projectId, _frozen);
    }

    function releaseFunds(
        string memory _projectId, 
        uint256 _milestoneIndex,
        string memory _proofHash
    ) external onlyOwner nonReentrant {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(!project.isFrozen, "Project is frozen");
        require(_milestoneIndex < project.milestoneCount, "Invalid milestone index");
        
        Milestone storage milestone = project.milestones[_milestoneIndex];
        require(!milestone.isReleased, "Milestone already released");

        milestone.isReleased = true;
        milestone.proofHash = _proofHash;
        project.releasedAmount += milestone.amount;
        
        (bool success, ) = payable(project.contractor).call{value: milestone.amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(_projectId, _milestoneIndex, milestone.amount, project.contractor);
    }

    function getMilestone(string memory _projectId, uint256 _index) external view returns (uint256 amount, bool isReleased, string memory proofHash) {
        Project storage project = projects[_projectId];
        require(_index < project.milestoneCount, "Invalid index");
        Milestone storage m = project.milestones[_index];
        return (m.amount, m.isReleased, m.proofHash);
    }

    function getProjectBalance(string memory _projectId) external view returns (uint256) {
        require(projects[_projectId].exists, "Project does not exist");
        return projects[_projectId].totalBudget - projects[_projectId].releasedAmount;
    }

    receive() external payable {}
}
