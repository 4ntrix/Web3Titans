# 4ntrix Smart Contract

## Overview

4ntrix is a smart contract written in Solidity, designed to manage occasions and ticket sales on the Ethereum blockchain. It allows users to list occasions, purchase tickets, mark attendance, and manage user details.

## Features

- **Occasion Management**: Admins can list new occasions with details such as name, cost, date, time, location, and an optional IPFS hash for an image related to the occasion.
- **Ticket Sales**: Users can purchase tickets for listed occasions, with a maximum limit of tickets per address.
- **Attendance Tracking**: Admins can mark attendance for users who have purchased tickets.
- **User Management**: Users can add their details, including name, Aadhar card number, and an IPFS hash for their image.
- **Ownership Transfer**: Ownership of the contract can be transferred, and admins can be added or removed.

## Contract Details

- **Solidity Version**: 0.8.9
- **ERC721 Token**: 4ntrix token inherits from ERC721 for non-fungible token functionality.
- **Access Control**: The contract uses Ownable for ownership management and access control.

## Usage

To use the contract, deploy it to the Ethereum blockchain. Admins can then interact with the contract to list occasions, mark attendance, and manage users. Users can purchase tickets and manage their details.

## Installation

To install the contract, clone this repository and deploy the `4ntrix.sol` file to your Ethereum development environment or live network.

## Development

This contract is developed in Solidity using the OpenZeppelin library for ERC721 and Ownable functionalities.

## License

This project is licensed under the UNLICENSED license.

