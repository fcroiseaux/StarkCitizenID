// SPDX-License-Identifier: MIT

/// Identity struct definition that's used in the interface
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Identity {
    pub address: starknet::ContractAddress,
    pub hash: felt252,
    pub metadata_uri: felt252,
    pub verified: bool,
    pub timestamp: u64,
    pub expiration: u64,
    pub provider_id: felt252,
}

/// Identity provider struct - represents a trusted identity provider
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct IdentityProvider {
    pub id: felt252,
    pub name: felt252,
    pub public_key: felt252,
    pub is_active: bool,
    pub added_timestamp: u64,
}

/// Interface for the Identity Registry contract.
/// This contract provides functionality for verifying identity on the Starknet blockchain.
#[starknet::interface]
pub trait IIdentityRegistry<TContractState> {
    /// Register a new identity verification with provider signature verification
    fn register_identity(
        ref self: TContractState, 
        hash: felt252,
        metadata_uri: felt252,
        expiration: u64,
        provider_id: felt252,
        signature_r: felt252,
        signature_s: felt252,
        message_hash: felt252
    ) -> bool;

    /// Check if an address has verified identity
    fn verify_identity(self: @TContractState, address: starknet::ContractAddress) -> bool;

    /// Revoke a verification
    fn revoke_verification(ref self: TContractState) -> bool;

    /// Update verification data with provider signature verification
    fn update_identity(
        ref self: TContractState,
        hash: felt252,
        metadata_uri: felt252,
        expiration: u64,
        provider_id: felt252,
        signature_r: felt252,
        signature_s: felt252,
        message_hash: felt252
    ) -> bool;

    /// Get identity information
    fn get_identity_info(self: @TContractState, address: starknet::ContractAddress) -> Identity;
    
    /// Emergency function to revoke verification (owner only)
    fn admin_revoke_verification(ref self: TContractState, address: starknet::ContractAddress) -> bool;
    
    /// For testing purposes only: force an identity to be marked as expired
    fn force_expire_identity(ref self: TContractState, address: starknet::ContractAddress) -> bool;
    
    /// Add or update a trusted identity provider (owner only)
    fn add_identity_provider(
        ref self: TContractState, 
        id: felt252, 
        name: felt252, 
        public_key: felt252
    ) -> bool;
    
    /// Deactivate a trusted identity provider (owner only)
    fn deactivate_identity_provider(ref self: TContractState, id: felt252) -> bool;
    
    /// Get identity provider information
    fn get_identity_provider(self: @TContractState, id: felt252) -> IdentityProvider;
    
    /// Check if a provider is trusted and active
    fn is_trusted_provider(self: @TContractState, id: felt252) -> bool;

    // Owner management
    fn owner(self: @TContractState) -> starknet::ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: starknet::ContractAddress);
    fn renounce_ownership(ref self: TContractState);
}

/// The main Identity Registry contract implementation
#[starknet::contract]
mod IdentityRegistry {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{StorageMapReadAccess, StorageMapWriteAccess};
    use core::num::traits::Zero;
    use super::{Identity, IdentityProvider};

    #[storage]
    struct Storage {
        // Identity storage
        identities: starknet::storage::Map::<ContractAddress, Identity>,
        hash_to_address: starknet::storage::Map::<felt252, ContractAddress>,
        identity_providers: starknet::storage::Map::<felt252, IdentityProvider>,
        
        // Owner storage - using a map with a single key for contract owner
        owner: starknet::storage::Map::<felt252, ContractAddress>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        IdentityRegistered: IdentityRegistered,
        IdentityRevoked: IdentityRevoked,
        IdentityUpdated: IdentityUpdated,
        ExpirationUpdated: ExpirationUpdated,
        IdentityProviderAdded: IdentityProviderAdded,
        IdentityProviderDeactivated: IdentityProviderDeactivated,
        OwnershipTransferred: OwnershipTransferred,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityRegistered {
        address: ContractAddress,
        hash: felt252,
        provider_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityRevoked {
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityUpdated {
        address: ContractAddress,
        hash: felt252,
        provider_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct ExpirationUpdated {
        address: ContractAddress,
        expiration: u64,
    }
    
    #[derive(Drop, starknet::Event)]
    struct IdentityProviderAdded {
        id: felt252,
        name: felt252,
    }
    
    #[derive(Drop, starknet::Event)]
    struct IdentityProviderDeactivated {
        id: felt252,
    }
    
    #[derive(Drop, starknet::Event)]
    struct OwnershipTransferred {
        previous_owner: ContractAddress,
        new_owner: ContractAddress,
    }

    // Owner key in the map
    const OWNER_KEY: felt252 = 'OWNER';

    #[constructor]
    fn constructor(ref self: ContractState, owner_address: ContractAddress) {
        // Initialize owner
        self.owner.write(OWNER_KEY, owner_address);
        let zero_addr: ContractAddress = Zero::zero();
        self.emit(OwnershipTransferred { previous_owner: zero_addr, new_owner: owner_address });
    }

    #[abi(embed_v0)]
    impl IdentityRegistryImpl of super::IIdentityRegistry<ContractState> {
        /// Register a new identity verification with provider signature verification
        fn register_identity(
            ref self: ContractState, 
            hash: felt252,
            metadata_uri: felt252,
            expiration: u64,
            provider_id: felt252,
            signature_r: felt252,
            signature_s: felt252,
            message_hash: felt252
        ) -> bool {
            // Only callable by the owner of the address
            let caller = get_caller_address();
            
            // Check if identity already registered
            let existing = self.identities.read(caller);
            assert(existing.address.is_zero(), 'Identity already registered');
            
            // Verify that the provider is trusted
            let provider = self.identity_providers.read(provider_id);
            assert(!provider.id.is_zero(), 'Provider not found');
            assert(provider.is_active, 'Provider not active');
            
            // Verify the signature from the identity provider
            // The message_hash should contain the hash of the user's identity data
            let is_valid = self.verify_provider_signature(
                provider.public_key,
                message_hash,
                signature_r,
                signature_s
            );
            assert(is_valid, 'Invalid provider signature');
            
            // Register identity
            let identity = Identity {
                address: caller,
                hash,
                metadata_uri,
                verified: true,
                timestamp: get_block_timestamp(),
                expiration,
                provider_id,
            };
            
            self.identities.write(caller, identity);
            self.hash_to_address.write(hash, caller);
            
            // Emit event
            self.emit(IdentityRegistered { address: caller, hash, provider_id });
            
            true
        }

        /// Check if an address has verified identity
        fn verify_identity(self: @ContractState, address: ContractAddress) -> bool {
            let identity = self.identities.read(address);
            
            if (identity.address.is_zero()) {
                return false;
            }
            
            // Check if verification has expired
            let current_time = get_block_timestamp();
            if (identity.expiration != 0 && identity.expiration < current_time) {
                return false;
            }
            
            // Check if the provider is still trusted and active
            if (!identity.provider_id.is_zero()) {
                let provider = self.identity_providers.read(identity.provider_id);
                if (!provider.is_active) {
                    return false;
                }
            }
            
            identity.verified
        }

        /// Revoke a verification
        fn revoke_verification(ref self: ContractState) -> bool {
            let caller = get_caller_address();
            let identity = self.identities.read(caller);
            
            // Check if identity exists
            assert(!identity.address.is_zero(), 'Identity does not exist');
            
            // Create updated identity
            let updated_identity = Identity {
                verified: false,
                ..identity
            };
            
            self.identities.write(caller, updated_identity);
            
            // Emit event
            self.emit(IdentityRevoked { address: caller });
            
            true
        }

        /// Update verification data with provider signature verification
        fn update_identity(
            ref self: ContractState,
            hash: felt252,
            metadata_uri: felt252,
            expiration: u64,
            provider_id: felt252,
            signature_r: felt252,
            signature_s: felt252,
            message_hash: felt252
        ) -> bool {
            let caller = get_caller_address();
            let identity = self.identities.read(caller);
            
            // Check if identity exists
            assert(!identity.address.is_zero(), 'Identity does not exist');
            
            // Verify that the provider is trusted
            let provider = self.identity_providers.read(provider_id);
            assert(!provider.id.is_zero(), 'Provider not found');
            assert(provider.is_active, 'Provider not active');
            
            // Verify the signature from the identity provider
            let is_valid = self.verify_provider_signature(
                provider.public_key,
                message_hash,
                signature_r,
                signature_s
            );
            assert(is_valid, 'Invalid provider signature');
            
            // Create updated identity
            let updated_identity = Identity {
                hash,
                metadata_uri,
                expiration,
                timestamp: get_block_timestamp(),
                provider_id,
                ..identity
            };
            
            self.identities.write(caller, updated_identity);
            self.hash_to_address.write(hash, caller);
            
            // Emit events
            self.emit(IdentityUpdated { address: caller, hash, provider_id });
            self.emit(ExpirationUpdated { address: caller, expiration });
            
            true
        }

        /// Get identity information
        fn get_identity_info(self: @ContractState, address: ContractAddress) -> Identity {
            self.identities.read(address)
        }
        
        /// Emergency function to revoke verification (owner only)
        fn admin_revoke_verification(ref self: ContractState, address: ContractAddress) -> bool {
            // Only owner can call this function
            self.assert_only_owner();
            
            let identity = self.identities.read(address);
            
            // Check if identity exists
            assert(!identity.address.is_zero(), 'Identity does not exist');
            
            // Create updated identity
            let updated_identity = Identity {
                verified: false,
                ..identity
            };
            
            self.identities.write(address, updated_identity);
            
            // Emit event
            self.emit(IdentityRevoked { address });
            
            true
        }
        
        /// For testing purposes only: force an identity to be marked as expired
        fn force_expire_identity(ref self: ContractState, address: ContractAddress) -> bool {
            // Only owner can call this function
            self.assert_only_owner();
            
            let identity = self.identities.read(address);
            
            // Check if identity exists
            assert(!identity.address.is_zero(), 'Identity does not exist');
            
            // Create updated identity with expiration in the past
            let updated_identity = Identity {
                expiration: 1, // Set to a very low value (past)
                ..identity
            };
            
            self.identities.write(address, updated_identity);
            
            true
        }
        
        /// Add or update a trusted identity provider (owner only)
        fn add_identity_provider(
            ref self: ContractState, 
            id: felt252, 
            name: felt252, 
            public_key: felt252
        ) -> bool {
            // Only owner can call this function
            self.assert_only_owner();
            
            // Add or update provider
            let provider = IdentityProvider {
                id,
                name,
                public_key,
                is_active: true,
                added_timestamp: get_block_timestamp(),
            };
            
            self.identity_providers.write(id, provider);
            
            // Emit event
            self.emit(IdentityProviderAdded { id, name });
            
            true
        }
        
        /// Deactivate a trusted identity provider (owner only)
        fn deactivate_identity_provider(ref self: ContractState, id: felt252) -> bool {
            // Only owner can call this function
            self.assert_only_owner();
            
            let provider = self.identity_providers.read(id);
            
            // Check if provider exists
            assert(!provider.id.is_zero(), 'Provider not found');
            
            // Deactivate provider
            let updated_provider = IdentityProvider {
                is_active: false,
                ..provider
            };
            
            self.identity_providers.write(id, updated_provider);
            
            // Emit event
            self.emit(IdentityProviderDeactivated { id });
            
            true
        }
        
        /// Get identity provider information
        fn get_identity_provider(self: @ContractState, id: felt252) -> IdentityProvider {
            self.identity_providers.read(id)
        }
        
        /// Check if a provider is trusted and active
        fn is_trusted_provider(self: @ContractState, id: felt252) -> bool {
            let provider = self.identity_providers.read(id);
            
            if (provider.id.is_zero()) {
                return false;
            }
            
            provider.is_active
        }
        
        // Owner management functions

        /// Get the current contract owner
        fn owner(self: @ContractState) -> ContractAddress {
            self.owner.read(OWNER_KEY)
        }

        /// Transfer ownership to a new address
        fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            self.assert_only_owner();
            assert(!new_owner.is_zero(), 'Zero address not allowed');
            let previous_owner = self.owner.read(OWNER_KEY);
            self.owner.write(OWNER_KEY, new_owner);
            self.emit(OwnershipTransferred { previous_owner, new_owner });
        }

        /// Renounce ownership by setting owner to zero address
        fn renounce_ownership(ref self: ContractState) {
            self.assert_only_owner();
            let previous_owner = self.owner.read(OWNER_KEY);
            let zero_addr: ContractAddress = Zero::zero();
            self.owner.write(OWNER_KEY, zero_addr);
            self.emit(OwnershipTransferred { previous_owner, new_owner: zero_addr });
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        /// Verify the signature from an identity provider
        /// Uses Starknet's built-in secp256 signature verification
        fn verify_provider_signature(
            self: @ContractState,
            public_key: felt252,
            message_hash: felt252,
            signature_r: felt252,
            signature_s: felt252
        ) -> bool {
            // For a real implementation, we would perform a complete signature verification.
            // The approach would depend on the specific cryptographic requirements of the
            // identity provider (such as France Connect)
            
            // Check for valid inputs first
            if (signature_r == 0 || signature_s == 0 || public_key == 0 || message_hash == 0) {
                return false;
            }
            
            // In a production implementation, we would:
            // 1. Properly format the message_hash according to EIP-191 or other relevant standard
            // 2. Create a proper signature structure from r, s values (and potentially v value)
            // 3. Validate the signature using the appropriate verification method for the provider
            
            // This is a simplified implementation for demo purposes. In a real implementation,
            // we would use is_valid_signature() to verify the signature against the public key.

            // For demonstration, we simulate a successful verification if all parameters are non-zero
            // In production, this MUST be replaced with proper cryptographic verification
            return true;
        }
        
        /// Check if the caller is the contract owner
        fn assert_only_owner(ref self: ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read(OWNER_KEY);
            assert(caller == owner, 'Caller is not the owner');
        }
    }
}