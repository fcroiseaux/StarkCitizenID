# StarkCitizenID

StarkCitizenID is a decentralized identity solution built on Starknet, enabling secure, sovereign digital identities that comply with regulatory frameworks including eIDAS.

## Project Structure

This repository contains the following components:

- **strk_eidas/**: Core identity registry contracts compatible with eIDAS standards
- More components will be added in the future

## StarkCitizenID eIDAS (strk_eidas)

The eIDAS-compatible identity registry is the foundation of StarkCitizenID, providing on-chain verification of user identities with time-based expiration and revocation capabilities.

See the [strk_eidas README](./strk_eidas/README.md) for detailed information about this component.

## Features

- **Decentralized Identity**: Users maintain sovereignty over their identity data
- **Regulatory Compliance**: Designed to work within eIDAS and other regulatory frameworks
- **On-chain Verification**: Smart contracts can verify identity status without accessing personal data
- **Privacy Preserving**: Stores cryptographic proofs, not personal data
- **Composability**: Designed to work with the broader Starknet ecosystem

## Vision

StarkCitizenID aims to become the standard for verified identities on Starknet, enabling a new generation of applications that require regulatory compliance while preserving user privacy and autonomy.

Future development will include:
- Integration with existing KYC/AML providers
- Multi-signature identity management
- Credential issuance and verification
- Social recovery mechanisms
- Enhanced privacy features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.