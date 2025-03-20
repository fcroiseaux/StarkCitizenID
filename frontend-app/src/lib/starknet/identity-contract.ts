import { Contract, Provider, constants, shortString, num } from 'starknet';
import identityRegistryAbi from './abi/identity-registry-abi.json';

// Get contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STARKNET_IDENTITY_CONTRACT_ADDRESS || '';

export interface Identity {
  address: string;
  hash: string;
  metadataUri: string;
  verified: boolean;
  timestamp: number;
  expiration: number;
  providerId: string;
}

export interface IdentityProvider {
  id: string;
  name: string;
  publicKey: string;
  isActive: boolean;
  addedTimestamp: number;
}

export class IdentityContract {
  private contract: Contract;
  private provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
    this.contract = new Contract(identityRegistryAbi, CONTRACT_ADDRESS, provider);
  }

  async registerIdentity(
    hash: string,
    metadataUri: string,
    expiration: number,
    providerId: string,
    signatureR: string,
    signatureS: string,
    messageHash: string
  ): Promise<string> {
    try {
      const result = await this.contract.invoke('register_identity', [
        hash,
        shortString.encodeShortString(metadataUri),
        expiration,
        providerId,
        signatureR,
        signatureS,
        messageHash,
      ]);
      return result.transaction_hash;
    } catch (error) {
      console.error('Failed to register identity:', error);
      throw error;
    }
  }

  async verifyIdentity(address: string): Promise<boolean> {
    try {
      const result = await this.contract.call('verify_identity', [address]);
      return result.toString() === '1';
    } catch (error) {
      console.error('Failed to verify identity:', error);
      return false;
    }
  }

  async revokeVerification(): Promise<string> {
    try {
      const result = await this.contract.invoke('revoke_verification', []);
      return result.transaction_hash;
    } catch (error) {
      console.error('Failed to revoke verification:', error);
      throw error;
    }
  }

  async updateIdentity(
    hash: string,
    metadataUri: string,
    expiration: number,
    providerId: string,
    signatureR: string,
    signatureS: string,
    messageHash: string
  ): Promise<string> {
    try {
      const result = await this.contract.invoke('update_identity', [
        hash,
        shortString.encodeShortString(metadataUri),
        expiration,
        providerId,
        signatureR,
        signatureS,
        messageHash,
      ]);
      return result.transaction_hash;
    } catch (error) {
      console.error('Failed to update identity:', error);
      throw error;
    }
  }

  async getIdentityInfo(address: string): Promise<Identity> {
    try {
      const result = await this.contract.call('get_identity_info', [address]);
      
      return {
        address: result.address,
        hash: result.hash,
        metadataUri: shortString.decodeShortString(result.metadata_uri),
        verified: result.verified,
        timestamp: Number(result.timestamp),
        expiration: Number(result.expiration),
        providerId: result.provider_id,
      };
    } catch (error) {
      console.error('Failed to get identity info:', error);
      throw error;
    }
  }

  async addIdentityProvider(
    id: string,
    name: string,
    publicKey: string
  ): Promise<string> {
    try {
      const result = await this.contract.invoke('add_identity_provider', [
        id,
        shortString.encodeShortString(name),
        publicKey,
      ]);
      return result.transaction_hash;
    } catch (error) {
      console.error('Failed to add identity provider:', error);
      throw error;
    }
  }

  async deactivateIdentityProvider(id: string): Promise<string> {
    try {
      const result = await this.contract.invoke('deactivate_identity_provider', [id]);
      return result.transaction_hash;
    } catch (error) {
      console.error('Failed to deactivate identity provider:', error);
      throw error;
    }
  }

  async getIdentityProvider(id: string): Promise<IdentityProvider> {
    try {
      const result = await this.contract.call('get_identity_provider', [id]);
      
      return {
        id: result.id,
        name: shortString.decodeShortString(result.name),
        publicKey: result.public_key,
        isActive: result.is_active,
        addedTimestamp: Number(result.added_timestamp),
      };
    } catch (error) {
      console.error('Failed to get identity provider:', error);
      throw error;
    }
  }

  async isTrustedProvider(id: string): Promise<boolean> {
    try {
      const result = await this.contract.call('is_trusted_provider', [id]);
      return result.toString() === '1';
    } catch (error) {
      console.error('Failed to check if provider is trusted:', error);
      return false;
    }
  }
}