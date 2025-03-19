/// Unit and integration tests for the Identity Registry contract
#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use core::traits::TryInto;
    use core::option::OptionTrait;
    use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait,
    start_cheat_caller_address, stop_cheat_caller_address,
    start_cheat_caller_address_global, stop_cheat_caller_address_global,
    start_cheat_block_timestamp_global, stop_cheat_block_timestamp_global
};
    use strk_eidas::{Identity, IIdentityRegistryDispatcher, IIdentityRegistryDispatcherTrait};

    /// Helper function to convert felt252 values to ContractAddress type
    fn contract_address_const(value: felt252) -> ContractAddress {
        value.try_into().unwrap()
    }

    /// Helper function to deploy a new contract instance for testing
    fn deploy_contract() -> (ContractAddress, IIdentityRegistryDispatcher) {
        let admin_address = contract_address_const(0x123);

        // Declare and deploy the contract
        let contract = declare("IdentityRegistry").unwrap().contract_class();
        let constructor_calldata = array![admin_address.into()];
        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

        // Create a dispatcher to interact with the contract
        let dispatcher = IIdentityRegistryDispatcher { contract_address };
        
        (contract_address, dispatcher)
    }

    #[test]
    fn test_contract_deployment() {
        // Deploy a new contract instance
        let (_, dispatcher) = deploy_contract();
        
        // Test admin address is set correctly
        let admin_address = contract_address_const(0x123);
        let stored_admin = dispatcher.get_admin();
        assert(stored_admin == admin_address, 'Admin address mismatch');
    }

    #[test]
    fn test_register_identity() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Register a new identity with a future expiration date
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000; // Some time in the future
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Register identity
        let result = dispatcher.register_identity(identity_hash, metadata_uri, expiration);
        assert(result, 'Registration should succeed');
        
        // Verify identity is registered correctly
        let is_verified = dispatcher.verify_identity(admin_address);
        assert(is_verified, 'Identity should be verified');
        
        // Get identity info and verify the data
        let identity_info = dispatcher.get_identity_info(admin_address);
        assert(identity_info.hash == identity_hash, 'Hash mismatch');
        assert(identity_info.metadata_uri == metadata_uri, 'Metadata URI mismatch');
        assert(identity_info.verified == true, 'Should be verified');
        assert(identity_info.expiration == expiration, 'Expiration mismatch');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_update_identity() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Register a new identity first
        let initial_hash: felt252 = 0x123456;
        let initial_metadata: felt252 = 0x789abc;
        let initial_expiration: u64 = 1735686000;
        
        // Register identity
        dispatcher.register_identity(initial_hash, initial_metadata, initial_expiration);
        
        // Update the identity with new values
        let new_hash: felt252 = 0xabcdef;
        let new_metadata: felt252 = 0xfedcba;
        let new_expiration: u64 = 1767222000; // Further in the future
        
        let result = dispatcher.update_identity(new_hash, new_metadata, new_expiration);
        assert(result, 'Update should succeed');
        
        // Get updated identity info and verify
        let updated_info = dispatcher.get_identity_info(admin_address);
        assert(updated_info.hash == new_hash, 'Hash not updated');
        assert(updated_info.metadata_uri == new_metadata, 'Metadata not updated');
        assert(updated_info.expiration == new_expiration, 'Expiration not updated');
        assert(updated_info.verified == true, 'Should still be verified');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_revoke_verification() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Register a new identity first
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // Register identity
        dispatcher.register_identity(identity_hash, metadata_uri, expiration);
        
        // Verify it's registered
        let is_verified_before = dispatcher.verify_identity(admin_address);
        assert(is_verified_before, 'Identity should be verified');
        
        // Revoke verification
        let result = dispatcher.revoke_verification();
        assert(result, 'Revocation should succeed');
        
        // Verify it's no longer verified
        let is_verified_after = dispatcher.verify_identity(admin_address);
        assert(!is_verified_after, 'Identity should be revoked');
        
        // Check the identity record directly
        let identity_info = dispatcher.get_identity_info(admin_address);
        assert(identity_info.verified == false, 'Should be marked as unverified');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_expiration() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Set a future expiration initially
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1000; // A timestamp in the "past" from our perspective
        
        // Register identity
        dispatcher.register_identity(identity_hash, metadata_uri, expiration);
        
        // Set the block timestamp to a value after the expiration
        start_cheat_block_timestamp_global(2000); // Set time to be after the expiration
        
        // Verify it's expired due to past expiration date
        let is_verified = dispatcher.verify_identity(admin_address);
        assert(!is_verified, 'Identity should be expired');
        
        stop_cheat_block_timestamp_global();
        stop_cheat_caller_address_global();
    }

    
    #[test]
    #[should_panic(expected: ('Identity already registered',))]
    fn test_double_registration() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Register an identity
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // First registration
        dispatcher.register_identity(identity_hash, metadata_uri, expiration);
        
        // Second registration should fail
        dispatcher.register_identity(identity_hash, metadata_uri, expiration);
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    #[should_panic(expected: ('Identity does not exist',))]
    fn test_update_nonexistent_identity() {
        // Deploy a new contract instance
        let (contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the admin
        let admin_address = contract_address_const(0x123);
        start_cheat_caller_address_global(admin_address);
        
        // Try to update without registering first
        let hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // Should panic with 'Identity does not exist'
        dispatcher.update_identity(hash, metadata_uri, expiration);
        
        stop_cheat_caller_address_global();
    }
}