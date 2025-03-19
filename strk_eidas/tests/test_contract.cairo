/// Unit and integration tests for the Identity Registry contract
#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use core::traits::TryInto;
    use core::option::OptionTrait;
    use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait,
    start_cheat_caller_address_global, stop_cheat_caller_address_global,
    start_cheat_block_timestamp_global, stop_cheat_block_timestamp_global
};
    use strk_eidas::{IIdentityRegistryDispatcher, IIdentityRegistryDispatcherTrait};
    use openzeppelin::access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};

    /// Helper function to convert felt252 values to ContractAddress type
    fn contract_address_const(value: felt252) -> ContractAddress {
        value.try_into().unwrap()
    }

    /// Helper function to deploy a new contract instance for testing
    fn deploy_contract() -> (ContractAddress, IIdentityRegistryDispatcher) {
        let owner_address = contract_address_const(0x123);

        // Declare and deploy the contract
        let contract = declare("IdentityRegistry").unwrap().contract_class();
        let constructor_calldata = array![owner_address.into()];
        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

        // Create a dispatcher to interact with the contract
        let dispatcher = IIdentityRegistryDispatcher { contract_address };
        
        (contract_address, dispatcher)
    }

    #[test]
    fn test_contract_deployment() {
        // Deploy a new contract instance
        let (contract_address, _dispatcher) = deploy_contract();
        
        // Test owner address is set correctly using the Ownable interface
        let owner_address = contract_address_const(0x123);
        let ownable_dispatcher = IOwnableDispatcher { contract_address };
        let stored_owner = ownable_dispatcher.owner();
        assert(stored_owner == owner_address, 'Wrong owner');
    }

    /// Helper function to set up an identity provider in the contract
    fn setup_identity_provider(dispatcher: IIdentityRegistryDispatcher) -> felt252 {
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Add a trusted identity provider
        let provider_id: felt252 = 0x456;
        let provider_name: felt252 = 0x4652414e43455f434f4e4e454354; // "FRANCE_CONNECT" in hex
        let provider_public_key: felt252 = 0x789; // Demo public key
        
        let result = dispatcher.add_identity_provider(provider_id, provider_name, provider_public_key);
        assert(result, 'Provider should be added');
        
        stop_cheat_caller_address_global();
        
        provider_id
    }
    
    #[test]
    fn test_add_identity_provider() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Add a trusted identity provider
        let provider_id: felt252 = 0x456;
        let provider_name: felt252 = 0x4652414e43455f434f4e4e454354; // "FRANCE_CONNECT" in hex
        let provider_public_key: felt252 = 0x789; // Demo public key
        
        let result = dispatcher.add_identity_provider(provider_id, provider_name, provider_public_key);
        assert(result, 'Provider add failed');
        
        // Verify provider is added correctly
        let provider = dispatcher.get_identity_provider(provider_id);
        assert(provider.id == provider_id, 'ID mismatch');
        assert(provider.name == provider_name, 'Name mismatch');
        assert(provider.public_key == provider_public_key, 'Key mismatch');
        assert(provider.is_active == true, 'Not active');
        
        // Check trusted provider status
        let is_trusted = dispatcher.is_trusted_provider(provider_id);
        assert(is_trusted, 'Not trusted');
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    fn test_deactivate_identity_provider() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Deactivate the provider
        let result = dispatcher.deactivate_identity_provider(provider_id);
        assert(result, 'Deactivation failed');
        
        // Verify provider is deactivated
        let provider = dispatcher.get_identity_provider(provider_id);
        assert(provider.id == provider_id, 'Wrong ID');
        assert(provider.is_active == false, 'Not inactive');
        
        // Check trusted provider status
        let is_trusted = dispatcher.is_trusted_provider(provider_id);
        assert(!is_trusted, 'Still trusted');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_register_identity() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Register a new identity with a future expiration date
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000; // Some time in the future
        
        // Signature values (simplified for testing as our implementation has a mock verification)
        let signature_r: felt252 = 0xaaa; // Mock signature value
        let signature_s: felt252 = 0xbbb; // Mock signature value
        let message_hash: felt252 = 0xccc; // Mock message hash
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Register identity with provider verification
        let result = dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        assert(result, 'Reg failed');
        
        // Verify identity is registered correctly
        let is_verified = dispatcher.verify_identity(owner_address);
        assert(is_verified, 'Not verified');
        
        // Get identity info and verify the data
        let identity_info = dispatcher.get_identity_info(owner_address);
        assert(identity_info.hash == identity_hash, 'Hash mismatch');
        assert(identity_info.metadata_uri == metadata_uri, 'URI wrong');
        assert(identity_info.verified == true, 'Not verified');
        assert(identity_info.expiration == expiration, 'Wrong exp');
        assert(identity_info.provider_id == provider_id, 'Wrong ID');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_update_identity() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa; 
        let signature_s: felt252 = 0xbbb; 
        let message_hash: felt252 = 0xccc;
        
        // Register a new identity first
        let initial_hash: felt252 = 0x123456;
        let initial_metadata: felt252 = 0x789abc;
        let initial_expiration: u64 = 1735686000;
        
        // Register identity
        dispatcher.register_identity(
            initial_hash, 
            initial_metadata, 
            initial_expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        // Update the identity with new values
        let new_hash: felt252 = 0xabcdef;
        let new_metadata: felt252 = 0xfedcba;
        let new_expiration: u64 = 1767222000; // Further in the future
        
        // Updated signature values
        let new_signature_r: felt252 = 0xddd;
        let new_signature_s: felt252 = 0xeee;
        let new_message_hash: felt252 = 0xfff;
        
        let result = dispatcher.update_identity(
            new_hash, 
            new_metadata, 
            new_expiration, 
            provider_id, 
            new_signature_r, 
            new_signature_s, 
            new_message_hash
        );
        assert(result, 'Update failed');
        
        // Get updated identity info and verify
        let updated_info = dispatcher.get_identity_info(owner_address);
        assert(updated_info.hash == new_hash, 'Hash wrong');
        assert(updated_info.metadata_uri == new_metadata, 'Meta wrong');
        assert(updated_info.expiration == new_expiration, 'Exp wrong');
        assert(updated_info.verified == true, 'Not verified');
        assert(updated_info.provider_id == provider_id, 'Wrong provider');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_revoke_verification() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Register a new identity first
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // Register identity
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        // Verify it's registered
        let is_verified_before = dispatcher.verify_identity(owner_address);
        assert(is_verified_before, 'Not verified');
        
        // Revoke verification
        let result = dispatcher.revoke_verification();
        assert(result, 'Rev failed');
        
        // Verify it's no longer verified
        let is_verified_after = dispatcher.verify_identity(owner_address);
        assert(!is_verified_after, 'Still verified');
        
        // Check the identity record directly
        let identity_info = dispatcher.get_identity_info(owner_address);
        assert(identity_info.verified == false, 'Still verified');
        
        stop_cheat_caller_address_global();
    }

    #[test]
    fn test_expiration() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Set a future expiration initially
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1000; // A timestamp in the "past" from our perspective
        
        // Register identity
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        // Set the block timestamp to a value after the expiration
        start_cheat_block_timestamp_global(2000); // Set time to be after the expiration
        
        // Verify it's expired due to past expiration date
        let is_verified = dispatcher.verify_identity(owner_address);
        assert(!is_verified, 'Not expired');
        
        stop_cheat_block_timestamp_global();
        stop_cheat_caller_address_global();
    }
    
    #[test]
    fn test_verify_with_inactive_provider() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Register a new identity first
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000; // Far in the future
        
        // Register identity
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        // Verify it's registered and active
        let is_verified_before = dispatcher.verify_identity(owner_address);
        assert(is_verified_before, 'Not verified');
        
        // Deactivate the provider
        dispatcher.deactivate_identity_provider(provider_id);
        
        // Verification should now fail because the provider is inactive
        let is_verified_after = dispatcher.verify_identity(owner_address);
        assert(!is_verified_after, 'Still verified');
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    #[should_panic(expected: ('Identity already registered',))]
    fn test_double_registration() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Register an identity
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // First registration
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        // Second registration should fail
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    #[should_panic(expected: ('Identity does not exist',))]
    fn test_update_nonexistent_identity() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Add a provider
        let provider_id = setup_identity_provider(dispatcher);
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Try to update without registering first
        let hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // Should panic with 'Identity does not exist'
        dispatcher.update_identity(
            hash, 
            metadata_uri, 
            expiration, 
            provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    #[should_panic(expected: ('Provider not found',))]
    fn test_register_with_nonexistent_provider() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be the owner
        let owner_address = contract_address_const(0x123);
        start_cheat_caller_address_global(owner_address);
        
        // Signature values (simplified for testing)
        let signature_r: felt252 = 0xaaa;
        let signature_s: felt252 = 0xbbb;
        let message_hash: felt252 = 0xccc;
        
        // Register using a provider that doesn't exist
        let nonexistent_provider_id: felt252 = 0xdead;
        let identity_hash: felt252 = 0x123456;
        let metadata_uri: felt252 = 0x789abc;
        let expiration: u64 = 1735686000;
        
        // Should panic with 'Provider not found'
        dispatcher.register_identity(
            identity_hash, 
            metadata_uri, 
            expiration, 
            nonexistent_provider_id, 
            signature_r, 
            signature_s, 
            message_hash
        );
        
        stop_cheat_caller_address_global();
    }
    
    #[test]
    #[should_panic(expected: ('Caller is not the owner',))]
    fn test_add_provider_as_non_owner() {
        // Deploy a new contract instance
        let (_contract_address, dispatcher) = deploy_contract();
        
        // Set the caller address to be a non-owner
        let non_owner_address = contract_address_const(0x456);
        start_cheat_caller_address_global(non_owner_address);
        
        // Try to add a provider as non-owner
        let provider_id: felt252 = 0x456;
        let provider_name: felt252 = 0x4652414e43455f434f4e4e454354;
        let provider_public_key: felt252 = 0x789;
        
        // Should panic with 'Caller is not the owner'
        dispatcher.add_identity_provider(provider_id, provider_name, provider_public_key);
        
        stop_cheat_caller_address_global();
    }
}