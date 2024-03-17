// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Antrix is ERC721, Ownable {
    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 maxTickets;
        string date;
        string time;
        string location;
        string ipfsImageHash;
        bool markedAttended;
    }

    struct User {
        string name;
        string aadharCard;
        string ipfsImageHash;
    }

    uint256 public totalOccasions;
    uint256 public totalTickets;

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(address => User) public users;

    event OccasionListed(
        uint256 indexed id,
        string name,
        uint256 cost,
        uint256 maxTickets,
        string date,
        string time,
        string location,
        string ipfsImageHash,
        bool markedAttended
    );
    event TicketsPurchased(address indexed buyer, uint256 indexed occasionId);
    event AttendanceMarked(address indexed attendee, uint256 indexed occasionId);

    modifier onlyAdminOrOwner() {
        require(owner() == msg.sender || admins[msg.sender], "Caller is not an admin or owner");
        _;
    }

    mapping(address => bool) public admins;

    constructor(address _owner) ERC721("Antrix", "ANT") Ownable(_owner) {
        admins[_owner] = true;
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner(), "Cannot remove owner as admin");
        admins[_admin] = false;
    }

    function listOccasion(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _ipfsImageHash,
        bool _markedAttended
    ) public onlyAdminOrOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _date,
            _time,
            _location,
            _ipfsImageHash,
            _markedAttended
        );
        emit OccasionListed(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _date,
            _time,
            _location,
            _ipfsImageHash,
            _markedAttended
        );
    }

    function buyTicket(uint256 _id) public payable {
        require(_id <= totalOccasions && _id > 0, "Invalid occasion ID");
        Occasion storage occasion = occasions[_id];
        require(occasion.maxTickets > 0, "Tickets sold out");
        require(!hasBought[_id][msg.sender], "Already bought a ticket");

        uint256 ticketCost = occasion.cost;
        require(msg.value >= occasions[_id].cost, "Insufficient payment");

        occasions[_id].maxTickets--;
        totalTickets++;

        _safeMint(msg.sender, totalTickets);
        hasBought[_id][msg.sender] = true;

        // Refund excess payment
        uint256 excessPayment = msg.value - ticketCost;
        if (excessPayment > 0) {
            payable(msg.sender).transfer(excessPayment);
        }

        emit TicketsPurchased(msg.sender, _id);
    }

    function markAttendance(uint256 _id, address _attendee) public onlyAdminOrOwner {
        require(_id <= totalOccasions && _id > 0, "Invalid occasion ID");
        require(hasBought[_id][_attendee], "Address has not bought a ticket for this occasion");

        hasBought[_id][_attendee] = true;
        occasions[_id].markedAttended = true;

        emit AttendanceMarked(_attendee, _id);
    }

    function setOccasionDetails(
        uint256 _id,
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) external onlyAdminOrOwner {
        require(_id <= totalOccasions && _id > 0, "Invalid occasion ID");

        Occasion storage occasion = occasions[_id];

        // Ensure the occasion name is unique
        for (uint256 i = 1; i <= totalOccasions; i++) {
            if (i != _id && keccak256(abi.encodePacked(occasions[i].name)) == keccak256(abi.encodePacked(_name))) {
                revert("Cannot set occasion details to existing occasion's name");
            }
        }

        occasion.name = _name;
        occasion.cost = _cost;
        occasion.maxTickets = _maxTickets;
        occasion.date = _date;
        occasion.time = _time;
        occasion.location = _location;
    }

    function withdraw() public onlyAdminOrOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        super.transferOwnership(newOwner);
        admins[owner()] = false;
        admins[newOwner] = true;
    }

    function getNumTicketsPurchased(address _address) public view returns (uint256) {
        uint256 numTickets = 0;
        for (uint256 i = 1; i <= totalOccasions; i++) {
            if (hasBought[i][_address]) {
                numTickets++;
            }
        }
        return numTickets;
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        require(_id <= totalOccasions && _id > 0, "Invalid occasion ID");
        return occasions[_id];
    }

    function addUser(
        string memory _name,
        string memory _aadharCard,
        string memory _ipfsImageHash
    ) public {
        users[msg.sender] = User(_name, _aadharCard, _ipfsImageHash);
    }

    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function getAllOccasions() public view returns (Occasion[] memory) {
        Occasion[] memory allOccasions = new Occasion[](totalOccasions);
        for (uint256 i = 1; i <= totalOccasions; i++) {
            allOccasions[i - 1] = occasions[i];
        }
        return allOccasions;
    }

    function getTicketsByAddress(address _address) public view returns (uint256[] memory) {
        uint256[] memory tickets = new uint256[](totalTickets);
        uint256 ticketCount = 0;

        for (uint256 i = 1; i <= totalOccasions; i++) {
            if (hasBought[i][_address]) {
                tickets[ticketCount] = i;
                ticketCount++;
            }
        }

        uint256[] memory result = new uint256[](ticketCount);
        for (uint256 j = 0; j < ticketCount; j++) {
            result[j] = tickets[j];
        }

        return result;
    }

    function getUsersForOccasion(uint256 _occasionId) public view returns (address[] memory) {
        address[] memory usersForOccasion = new address[](totalTickets);
        uint256 userCount = 0;

        for (uint256 i = 1; i <= totalTickets; i++) {
            if (ownerOf(i) != address(0) && hasBought[_occasionId][ownerOf(i)]) {
                usersForOccasion[userCount] = ownerOf(i);
                userCount++;
            }
        }

        address[] memory result = new address[](userCount);
        for (uint256 j = 0; j < userCount; j++) {
            result[j] = usersForOccasion[j];
        }

        return result;
    }
}
