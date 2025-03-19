# Functional Specification Document
# France Connect to Starknet Identity Bridge DApp

## Document Information
**Version:** 1.1  
**Date:** March 18, 2025  
**Status:** Draft  

## 1. Introduction

### 1.1 Purpose
This document outlines the functional specifications for a decentralized application (DApp) that bridges official French digital identities (via France Connect) to Starknet blockchain accounts. The DApp will provide secure, verified identity linking between government-issued identities and blockchain addresses without requiring a traditional backend server.

### 1.2 Project Scope
The DApp will authenticate users via France Connect, verify their official identities, and create a secure link to their Starknet accounts directly through a serverless architecture. This creates a bridge between traditional identity systems and Web3, enabling trusted interactions on the Starknet blockchain with real-world identity verification.

### 1.3 Objectives
- Create a secure and compliant decentralized identity verification system
- Link verified France Connect identities to Starknet accounts
- Maintain user privacy and data protection through client-side processing
- Facilitate trust in blockchain interactions with minimal infrastructure
- Provide a seamless user experience through a modern DApp interface

### 1.4 Target Users
- French citizens with France Connect identities
- Individuals who want to use officially verified identities in blockchain applications
- Businesses requiring KYC for blockchain transactions
- Developers building applications on Starknet that require identity verification

## 2. System Overview

### 2.1 System Architecture
The system consists of three main components in a serverless architecture:

1. **NextJS Frontend Application**: Provides the user interface and handles all business logic, including France Connect authentication, identity processing, and blockchain interactions
2. **Smart Contracts**: Cairo-based contracts deployed on Starknet that store verification status and manage identity mappings
3. **Decentralized Storage**: IPFS or similar solution for storing encrypted metadata when necessary

### 2.2 Data Flow
1. User initiates authentication via France Connect through the NextJS frontend
2. After successful authentication, the frontend receives and processes verified identity attributes
3. User connects their Starknet wallet to the application
4. Frontend verifies wallet ownership through signature
5. Frontend generates cryptographic proof linking the verified identity to the Starknet address
6. Proof is submitted to the Starknet smart contract through the frontend
7. Any additional metadata is encrypted client-side and stored on IPFS with reference stored on-chain

### 2.3 Technical Environment
- **Frontend**: NextJS 14+ with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Blockchain**: Starknet mainnet and testnet
- **Smart Contracts**: Cairo 2.0+
- **Authentication**: OpenID Connect via France Connect
- **Blockchain Libraries**: starknet.js, get-starknet
- **Storage**: IPFS for encrypted metadata (if needed)

## 3. Functional Requirements

### 3.1 User Registration and Authentication

#### 3.1.1 France Connect Authentication
- **FR-1.1:** The DApp shall implement the France Connect OpenID Connect flow for user authentication directly in the frontend
- **FR-1.2:** The DApp shall request the necessary identity scopes from France Connect
- **FR-1.3:** The DApp shall validate all tokens and signatures from France Connect client-side
- **FR-1.4:** The DApp shall extract and process the required identity attributes in the browser without persistent storage
- **FR-1.5:** The DApp shall handle authentication errors gracefully with appropriate user feedback

#### 3.1.2 Identity Processing
- **FR-1.6:** The DApp shall process identity data entirely client-side
- **FR-1.7:** The DApp shall generate a unique identifier derived from France Connect identity data
- **FR-1.8:** The DApp shall use cryptographic techniques to protect identity data
- **FR-1.9:** The DApp shall provide users with transparent information about data processing
- **FR-1.10:** The DApp shall only store minimal identity references in browser session storage

### 3.2 Starknet Account Linking

#### 3.2.1 Wallet Connection
- **FR-2.1:** The DApp shall provide an interface for users to connect their Starknet wallet
- **FR-2.2:** The DApp shall support multiple wallet providers through the get-starknet library
- **FR-2.3:** The DApp shall require users to sign a message proving wallet ownership
- **FR-2.4:** The DApp shall verify the signature client-side before establishing the link
- **FR-2.5:** The DApp shall allow users to disconnect and reconnect different wallets

#### 3.2.2 Identity Verification
- **FR-2.6:** The DApp shall create a secure hash of verified identity attributes in the browser
- **FR-2.7:** The DApp shall submit the hash and verification status to the Starknet blockchain via smart contract
- **FR-2.8:** The DApp shall provide proof of verification without exposing personal data
- **FR-2.9:** The DApp shall support updating the verification when identity data changes
- **FR-2.10:** The DApp shall handle all blockchain interactions through the frontend application

### 3.3 User Dashboard

#### 3.3.1 Account Management
- **FR-3.1:** The DApp shall provide a dashboard showing identity verification status
- **FR-3.2:** The DApp shall display the connected Starknet account address
- **FR-3.3:** The DApp shall allow users to view which identity attributes are verified
- **FR-3.4:** The DApp shall provide options to disconnect wallets or revoke verification
- **FR-3.5:** The DApp shall allow users to remove verification status from the blockchain

#### 3.3.2 Verification Status
- **FR-3.6:** The DApp shall display the verification status from the blockchain
- **FR-3.7:** The DApp shall provide a transaction history of verification operations
- **FR-3.8:** The DApp shall alert users if verification expires or needs renewal
- **FR-3.9:** The DApp shall offer verification renewal through France Connect
- **FR-3.10:** The DApp shall allow public verification status checking for any address

### 3.4 Smart Contract Interactions

#### 3.4.1 Verification Registry
- **FR-4.1:** The DApp shall interact with a Cairo smart contract for storing verification status
- **FR-4.2:** The smart contract shall store only verification hashes, not personal data
- **FR-4.3:** The smart contract shall provide public functions to check verification status
- **FR-4.4:** The smart contract shall implement proper access controls
- **FR-4.5:** The smart contract shall emit events for verification status changes

#### 3.4.2 Identity Management
- **FR-4.6:** The smart contract shall provide functions to register, update, and revoke verifications
- **FR-4.7:** The smart contract shall maintain verification timestamps and expiration dates
- **FR-4.8:** The smart contract shall support administrator functions for emergency situations
- **FR-4.9:** The smart contract shall support metadata references for extended verification information

### 3.5 Decentralized Storage

#### 3.5.1 Metadata Storage
- **FR-5.1:** The DApp shall encrypt any necessary metadata client-side before storage
- **FR-5.2:** The DApp shall store encrypted metadata on IPFS when needed
- **FR-5.3:** The DApp shall store IPFS content identifiers (CIDs) in the smart contract
- **FR-5.4:** The DApp shall implement appropriate key management for encryption/decryption
- **FR-5.5:** The DApp shall support retrieving and decrypting metadata client-side

#### 3.5.2 Data Management
- **FR-5.6:** The DApp shall allow users to update stored metadata
- **FR-5.7:** The DApp shall support removal of outdated metadata
- **FR-5.8:** The DApp shall handle IPFS availability issues gracefully
- **FR-5.9:** The DApp shall minimize metadata storage to essential information only

## 4. Non-Functional Requirements

### 4.1 Security Requirements
- **NFR-1.1:** All communications with France Connect shall use TLS 1.2 or higher
- **NFR-1.2:** Identity data processing shall happen exclusively client-side
- **NFR-1.3:** The DApp shall implement proper key management for all cryptographic operations
- **NFR-1.4:** The DApp shall implement OWASP security best practices for frontend applications
- **NFR-1.5:** Smart contracts shall undergo formal verification and security audits
- **NFR-1.6:** The DApp shall implement proper Content Security Policy (CSP)

### 4.2 Privacy Requirements
- **NFR-2.1:** The DApp shall comply with GDPR requirements
- **NFR-2.2:** The DApp shall implement data minimization principles with no backend storage
- **NFR-2.3:** The DApp shall provide mechanisms for users to exercise their data rights
- **NFR-2.4:** The DApp shall provide transparency on all data processing activities
- **NFR-2.5:** The DApp shall only store cryptographic proofs on-chain, not personal data

### 4.3 Performance Requirements
- **NFR-3.1:** The client-side authentication process shall complete within 5 seconds (not including France Connect)
- **NFR-3.2:** Smart contract operations shall be optimized to minimize gas costs
- **NFR-3.3:** The DApp frontend shall be optimized for Core Web Vitals metrics
- **NFR-3.4:** The DApp shall handle blockchain transaction delays gracefully
- **NFR-3.5:** The DApp shall implement proper loading states for all operations

### 4.4 Reliability Requirements
- **NFR-4.1:** The DApp shall implement proper error handling for all operations
- **NFR-4.2:** The DApp shall include comprehensive client-side logging
- **NFR-4.3:** The DApp shall handle network interruptions gracefully
- **NFR-4.4:** The smart contracts shall implement fallback mechanisms for critical functions
- **NFR-4.5:** The DApp shall provide transaction monitoring and confirmation feedback

### 4.5 Usability Requirements
- **NFR-5.1:** The user interface shall be intuitive and accessible
- **NFR-5.2:** The DApp shall provide clear feedback for all user actions
- **NFR-5.3:** The DApp shall support both desktop and mobile devices
- **NFR-5.4:** Authentication flows shall be streamlined and user-friendly
- **NFR-5.5:** Error messages shall be clear and actionable
- **NFR-5.6:** The DApp shall provide guided workflows for complex operations

## 5. User Scenarios

### 5.1 New User Verification
1. User navigates to the DApp landing page
2. User clicks on "Sign in with France Connect" button
3. User is redirected to France Connect login page
4. User authenticates with their preferred identity provider
5. User is redirected back to the DApp
6. DApp processes the identity information client-side
7. User is prompted to connect their Starknet wallet
8. User connects wallet and signs verification message
9. DApp submits the verification transaction to the Starknet blockchain
10. User is directed to their dashboard showing verification status and transaction progress

### 5.2 Returning User Session
1. User navigates to the DApp
2. User connects their Starknet wallet
3. DApp detects existing verification for the wallet
4. DApp displays the verification status and details
5. User can view their verification proof on the blockchain

### 5.3 Wallet Change
1. User with verified identity navigates to the verification page
2. User selects "Change connected wallet"
3. DApp prompts for confirmation to disconnect current wallet
4. User confirms and is prompted to connect new wallet
5. User connects new wallet and signs verification message
6. User authenticates again with France Connect to confirm identity
7. DApp submits new verification transaction to the blockchain
8. Dashboard reflects the new connected wallet with pending verification

### 5.4 Third-Party Verification Check
1. Third-party DApp needs to verify a Starknet address
2. Third-party directly queries the verification smart contract
3. Smart contract returns verification status (verified/not verified)
4. Third-party can view verification timestamp and status
5. Third-party application uses this information for their service

## 6. Integration Requirements

### 6.1 France Connect Integration
- **IR-1.1:** The DApp shall register as a FranceConnect service provider
- **IR-1.2:** The DApp shall implement the required OpenID Connect flow in the frontend
- **IR-1.3:** The DApp shall maintain compliance with FranceConnect requirements
- **IR-1.4:** The DApp shall handle France Connect production and test environments
- **IR-1.5:** The DApp shall securely process authentication tokens client-side

### 6.2 Starknet Integration
- **IR-2.1:** The DApp shall integrate with Starknet testnet and mainnet
- **IR-2.2:** The DApp shall handle wallet connections via get-starknet
- **IR-2.3:** The DApp shall implement proper transaction handling and error recovery
- **IR-2.4:** The DApp shall adapt to Starknet protocol updates
- **IR-2.5:** The DApp shall support multiple Starknet wallet providers

### 6.3 IPFS Integration
- **IR-3.1:** The DApp shall integrate with IPFS for decentralized storage when needed
- **IR-3.2:** The DApp shall support multiple IPFS gateways for reliability
- **IR-3.3:** The DApp shall handle content addressing and retrieval
- **IR-3.4:** The DApp shall implement client-side encryption before IPFS storage

## 7. Data Requirements

### 7.1 Client-Side Data Processing
- **DR-1.1:** The DApp shall process identity data exclusively in the browser
- **DR-1.2:** Temporary data shall be stored only in browser session storage
- **DR-1.3:** The DApp shall clear sensitive data from memory after processing
- **DR-1.4:** The DApp shall use secure cryptographic techniques for data protection

### 7.2 Blockchain Data
- **Identity Hash**: Cryptographic representation of verified identity
- **Verification Status**: Boolean verification status
- **Metadata Reference**: IPFS CID for any additional encrypted data
- **Timestamp**: Verification time and expiration
- **Wallet Address**: Starknet account address

## 8. Compliance Requirements

### 8.1 GDPR Compliance
- **CR-1.1:** The DApp shall provide a clear privacy policy
- **CR-1.2:** The DApp shall obtain necessary consent for data processing
- **CR-1.3:** The DApp shall implement privacy by design principles
- **CR-1.4:** The DApp shall provide verification revocation functionality
- **CR-1.5:** The DApp shall minimize data collection and processing

### 8.2 eIDAS Compliance
- **CR-2.1:** The DApp shall maintain appropriate security measures for identity data
- **CR-2.2:** The DApp shall ensure traceability of all identity operations through blockchain records
- **CR-2.3:** The DApp shall comply with relevant trust service requirements
- **CR-2.4:** The DApp shall implement appropriate levels of assurance for identity verification

## 9. Technical Constraints

### 9.1 Development Constraints
- The DApp must be developed using NextJS and related frontend technologies
- The Starknet integration is limited by the capabilities of available libraries
- Smart contracts must be developed in Cairo 2.0+ language
- France Connect integration must follow their technical specifications
- All business logic must be implemented client-side without traditional backend server

### 9.2 Operational Constraints
- The DApp must operate within the technical requirements of FranceConnect
- The DApp must adapt to any changes in the France Connect API
- The DApp must handle Starknet network congestion and outages
- The DApp must meet French legal requirements for identity services
- The DApp must function without centralized server infrastructure

## 10. Acceptance Criteria

### 10.1 User Authentication
- Successful France Connect authentication through the frontend
- Proper client-side processing of identity attributes
- Secure session management using browser storage
- Proper error handling and user feedback

### 10.2 Wallet Connection
- Successful wallet connection via get-starknet
- Proper signature verification client-side
- Secure blockchain submission of verification data
- Ability to change connected wallets

### 10.3 Blockchain Verification
- Successful deployment of Cairo verification contracts
- Proper storage of verification hashes
- Successful verification status queries
- Proper event emission and handling

### 10.4 Security and Privacy
- Passing security audit of both frontend code and smart contracts
- Compliance with GDPR requirements in a decentralized context
- Proper client-side encryption of any sensitive data
- Implementation of appropriate access controls

## 11. Glossary

- **France Connect**: The French government's federated identity system
- **eIDAS**: Electronic Identification, Authentication and Trust Services regulation
- **Starknet**: A layer 2 scaling solution for Ethereum using STARK proofs
- **Cairo**: The programming language used for Starknet smart contracts
- **DApp**: Decentralized Application running without a traditional backend server
- **IPFS
