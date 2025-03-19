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
}

/// Interface for the Identity Registry contract.
/// This contract provides functionality for verifying identity on the Starknet blockchain.
#[starknet::interface]
pub trait IIdentityRegistry<TContractState> {
    /// Register a new identity verification
    fn register_identity(
        ref self: TContractState, 
        hash: felt252,
        metadata_uri: felt252,
        expiration: u64
    ) -> bool;

    /// Check if an address has verified identity
    fn verify_identity(self: @TContractState, address: starknet::ContractAddress) -> bool;

    /// Revoke a verification
    fn revoke_verification(ref self: TContractState) -> bool;

    /// Update verification data
    fn update_identity(
        ref self: TContractState,
        hash: felt252,
        metadata_uri: felt252,
        expiration: u64
    ) -> bool;

    /// Get identity information
    fn get_identity_info(self: @TContractState, address: starknet::ContractAddress) -> Identity;

    /// Set or update contract administrator
    fn set_admin(ref self: TContractState, new_admin: starknet::ContractAddress);

    /// Get the current contract administrator
    fn get_admin(self: @TContractState) -> starknet::ContractAddress;
    
    /// Emergency function to revoke verification (admin only)
    fn admin_revoke_verification(ref self: TContractState, address: starknet::ContractAddress) -> bool;
    
    /// For testing purposes only: force an identity to be marked as expired
    fn force_expire_identity(ref self: TContractState, address: starknet::ContractAddress) -> bool;
}

/// The main Identity Registry contract implementation
#[starknet::contract]
mod IdentityRegistry {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::num::traits::Zero;
    use super::Identity;

    #[storage]
    struct Storage {
        admin: ContractAddress,
        identities: starknet::storage::Map::<ContractAddress, Identity>,
        hash_to_address: starknet::storage::Map::<felt252, ContractAddress>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        IdentityRegistered: IdentityRegistered,
        IdentityRevoked: IdentityRevoked,
        IdentityUpdated: IdentityUpdated,
        ExpirationUpdated: ExpirationUpdated,
        AdminChanged: AdminChanged,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityRegistered {
        address: ContractAddress,
        hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityRevoked {
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct IdentityUpdated {
        address: ContractAddress,
        hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct ExpirationUpdated {
        address: ContractAddress,
        expiration: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct AdminChanged {
        old_admin: ContractAddress,
        new_admin: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin_address: ContractAddress) {
        self.admin.write(admin_address);
    }

    #[abi(embed_v0)]
    impl IdentityRegistryImpl of super::IIdentityRegistry<ContractState> {
        /// Register a new identity verification
        fn register_identity(
            ref self: ContractState, 
            hash: felt252,
            metadata_uri: felt252,
            expiration: u64
        ) -> bool {
            // Only callable by the owner of the address
            let caller = get_caller_address();
            
            // Check if identity already registered
            let existing = self.identities.read(caller);
            assert(existing.address.is_zero(), 'Identity already registered');
            
            // Register identity
            let identity = Identity {
                address: caller,
                hash,
                metadata_uri,
                verified: true,
                timestamp: get_block_timestamp(),
                expiration,
            };
            
            self.identities.write(caller, identity);
            self.hash_to_address.write(hash, caller);
            
            // Emit event
            self.emit(IdentityRegistered { address: caller, hash });
            
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

        /// Update verification data
        fn update_identity(
            ref self: ContractState,
            hash: felt252,
            metadata_uri: felt252,
            expiration: u64
        ) -> bool {
            let caller = get_caller_address();
            let identity = self.identities.read(caller);
            
            // Check if identity exists
            assert(!identity.address.is_zero(), 'Identity does not exist');
            
            // Remove old hash mapping by writing to a different key
            // We don't need to remove the old mapping since we can just overwrite the current key
            
            // Create updated identity
            let updated_identity = Identity {
                hash,
                metadata_uri,
                expiration,
                timestamp: get_block_timestamp(),
                ..identity
            };
            
            self.identities.write(caller, updated_identity);
            self.hash_to_address.write(hash, caller);
            
            // Emit events
            self.emit(IdentityUpdated { address: caller, hash });
            self.emit(ExpirationUpdated { address: caller, expiration });
            
            true
        }

        /// Get identity information
        fn get_identity_info(self: @ContractState, address: ContractAddress) -> Identity {
            self.identities.read(address)
        }

        /// Set or update contract administrator
        fn set_admin(ref self: ContractState, new_admin: ContractAddress) {
            let caller = get_caller_address();
            let current_admin = self.admin.read();
            
            // Only the current admin can set a new admin
            assert(caller == current_admin, 'Not authorized');
            
            // Set new admin
            self.admin.write(new_admin);
            
            // Emit event
            self.emit(AdminChanged { old_admin: current_admin, new_admin });
        }

        /// Get the current contract administrator
        fn get_admin(self: @ContractState) -> ContractAddress {
            self.admin.read()
        }
        
        /// Emergency function to revoke verification (admin only)
        fn admin_revoke_verification(ref self: ContractState, address: ContractAddress) -> bool {
            InternalFunctions::admin_revoke_verification(ref self, address)
        }
        
        /// For testing purposes only: force an identity to be marked as expired
        fn force_expire_identity(ref self: ContractState, address: ContractAddress) -> bool {
            InternalFunctions::force_expire_identity(ref self, address)
        }
    }

    // Internal functions
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        /// Emergency function to revoke verification (admin only)
        fn admin_revoke_verification(ref self: ContractState, address: ContractAddress) -> bool {
            let caller = get_caller_address();
            let admin = self.admin.read();
            
            // Only admin can call this function
            assert(caller == admin, 'Not authorized');
            
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
            let caller = get_caller_address();
            let admin = self.admin.read();
            
            // Only admin can call this function
            assert(caller == admin, 'Not authorized');
            
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
    }
}