# StarkCitizenID - eIDAS Identity Verification on Starknet

StarkCitizenID is a decentralized identity solution built on Starknet, enabling secure, sovereign digital identities that comply with regulatory frameworks including eIDAS. It connects official eIDAS-compliant digital identities (like France Connect) to Starknet blockchain accounts, providing a privacy-preserving way to verify real-world identities on-chain without exposing personal data.

## Repository Structure

This repository contains the following components:

- **`strk_eidas/`**: Core identity registry contracts compatible with eIDAS standards
- **`frontend-app/`**: A Next.js frontend DApp that integrates with France Connect and interacts with the smart contracts

## Key Features

- **Decentralized Identity**: Users maintain sovereignty over their identity data
- **Regulatory Compliance**: Designed to work within eIDAS and other regulatory frameworks
- **On-chain Verification**: Smart contracts can verify identity status without accessing personal data
- **Privacy Preserving**: Stores cryptographic proofs, not personal data
- **Composability**: Designed to work with the broader Starknet ecosystem
- **Secure Identity Verification**: Link eIDAS-compliant identities (France Connect) to Starknet accounts
- **Provider Management**: Support for multiple trusted identity providers
- **Verification Management**: Register, update, and revoke identity verifications
- **Serverless Architecture**: Client-side processing without a traditional backend

## Getting Started

This project consists of two main components that need to be set up separately:

### Smart Contract (Cairo)

1. Navigate to the smart contract directory:
   ```
   cd strk_eidas
   ```

2. Install dependencies:
   ```
   scarb build
   ```

3. Run tests:
   ```
   scarb test
   ```

4. Deploy to Starknet (requires Starkli):
   ```
   # Configure your account first
   starkli deploy ...
   ```

See the [smart contract README](./strk_eidas/README.md) for more details.

### Frontend DApp (Next.js)

1. Navigate to the frontend directory:
   ```
   cd frontend-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables (see `.env.local.example`).

4. Start the development server:
   ```
   npm run dev
   ```

See the [frontend README](./frontend-app/README.md) for more details.

## Technical Overview

### Smart Contract Architecture

The StarkCitizenID smart contract implements:

- Secure identity registration with provider signatures
- Identity verification status checks
- Management of trusted identity providers
- Identity expiration and renewal mechanisms
- OpenZeppelin-based access control

### Frontend Architecture

The frontend DApp implements:

- France Connect OpenID Connect integration
- Starknet wallet connections via get-starknet
- Client-side identity processing
- Smart contract interactions via starknet.js
- Modern UI with Tailwind CSS and shadcn/ui

## Vision

StarkCitizenID aims to become the standard for verified identities on Starknet, enabling a new generation of applications that require regulatory compliance while preserving user privacy and autonomy.

Future development will include:
- Integration with additional eIDAS providers and KYC/AML services
- Multi-signature identity management
- Credential issuance and verification
- Social recovery mechanisms
- Enhanced privacy features

## Use Cases

- **KYC for DeFi applications**: Enable KYC-compliant DeFi without exposing user data
- **Government-verified identities**: Use official digital identities on Starknet
- **Trusted on-chain interactions**: Build applications requiring verified identities
- **Age verification**: Prove users are above certain age thresholds without exposing DOB

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.