# StarkCitizenID: eIDAS Compatible Identity Registry

A Starknet smart contract for managing digital identities compatible with eIDAS (Electronic Identification, Authentication and Trust Services) standards.

## Overview

StarkCitizenID is an on-chain identity registry that allows for secure verification and management of digital identities on the Starknet blockchain. The system enables:

- Registration of verified identities with cryptographic attestations
- Time-bound validity periods with automatic expiration
- Identity verification for third-party contracts
- Revocation and updating of identity information

This implementation is designed to be compatible with eIDAS standards for electronic identification.

## Features

- **Identity Registration**: Register an identity with a cryptographic hash and metadata
- **Identity Verification**: Verify an identity on-chain
- **Expiration Mechanism**: Identities expire after a specified time period
- **Revocation**: Identities can be revoked by the owner or admin
- **Updates**: Identity data can be updated while maintaining verification status

## Contract Structure

The `IdentityRegistry` contract provides the following main functions:

- `register_identity`: Register a new identity verification
- `verify_identity`: Check if an address has a verified identity
- `revoke_verification`: Revoke a verification
- `update_identity`: Update verification data
- `get_identity_info`: Get identity information

## Getting Started

### Prerequisites

- [Scarb](https://docs.swmansion.com/scarb/)
- [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/)

### Installation

1. Clone the repository:
```
git clone https://github.com/YourUsername/StarkCitizenID.git
cd StarkCitizenID/strk_eidas
```

2. Build the project:
```
scarb build
```

### Testing

Run the test suite with Starknet Foundry:

```
snforge test
```

## Usage

### Deploying the Contract

To deploy the contract to Starknet:

```
scarb run deploy --network <network>
```

### Integrating with Other Contracts

Other contracts can verify a user's identity by calling the `verify_identity` function:

```cairo
use strk_eidas::{IIdentityRegistryDispatcher, IIdentityRegistryDispatcherTrait};

// Create a dispatcher for the identity registry
let id_registry = IIdentityRegistryDispatcher { 
    contract_address: registry_address 
};

// Check if a user has a verified identity
let is_verified = id_registry.verify_identity(user_address);
if (is_verified) {
    // Proceed with operation that requires a verified identity
} else {
    // Handle unverified user
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.