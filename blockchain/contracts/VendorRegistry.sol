// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VendorRegistry is Ownable {
    struct Vendor {
        string name;
        string department;
        address wallet;
        bool isVerified;
        bool exists;
    }

    mapping(address => Vendor) public vendors;
    address[] public vendorAddresses;

    event VendorRegistered(address wallet, string name, string department);
    event VendorVerified(address wallet);

    constructor() Ownable(msg.sender) {}

    function registerVendor(string memory _name, string memory _department) external {
        require(!vendors[msg.sender].exists, "Vendor already registered");

        vendors[msg.sender] = Vendor({
            name: _name,
            department: _department,
            wallet: msg.sender,
            isVerified: false,
            exists: true
        });

        vendorAddresses.push(msg.sender);
        emit VendorRegistered(msg.sender, _name, _department);
    }

    function verifyVendor(address _vendorAddress) external onlyOwner {
        require(vendors[_vendorAddress].exists, "Vendor not registered");
        vendors[_vendorAddress].isVerified = true;
        emit VendorVerified(_vendorAddress);
    }

    function getVendor(address _vendorAddress) external view returns (
        string memory name,
        string memory department,
        bool isVerified
    ) {
        require(vendors[_vendorAddress].exists, "Vendor not found");
        Vendor memory v = vendors[_vendorAddress];
        return (v.name, v.department, v.isVerified);
    }

    function getVendorCount() external view returns (uint256) {
        return vendorAddresses.length;
    }
}
