'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connect, disconnect as disconnectWallet } from 'get-starknet';
import { Provider, constants } from 'starknet';

interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  loading: boolean;
  error: string | null;
  balances: {
    eth: string;
    strk: string;
  };
  fetchBalances: () => Promise<void>;
  balancesLoading: boolean;
}

interface Wallet {
  address: string;
  provider: Provider;
  isConnected: boolean;
}

const initialContext: WalletContextType = {
  wallet: null,
  connectWallet: async () => {},
  disconnect: () => {},
  signMessage: async () => '',
  loading: false,
  error: null,
  balances: {
    eth: '0',
    strk: '0'
  },
  fetchBalances: async () => {},
  balancesLoading: false
};

const WalletContext = createContext<WalletContextType>(initialContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState({ eth: '0', strk: '0' });
  const [balancesLoading, setBalancesLoading] = useState(false);

  // ETH and STRK token addresses
  const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
  const STRK_TOKEN_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

  const fetchBalances = async () => {
    if (!wallet) return;
    
    setBalancesLoading(true);
    try {
      // Fetch ETH balance
      const ethBalanceResponse = await wallet.provider.callContract({
        contractAddress: ETH_TOKEN_ADDRESS,
        entrypoint: 'balanceOf',
        calldata: [wallet.address]
      });
      
      // Fetch STRK balance
      const strkBalanceResponse = await wallet.provider.callContract({
        contractAddress: STRK_TOKEN_ADDRESS,
        entrypoint: 'balanceOf',
        calldata: [wallet.address]
      });
      
      // Convert from Wei to ETH (6 decimals for simplicity)
      const ethBalance = ethBalanceResponse.result ? 
        (parseInt(ethBalanceResponse.result[0], 16) / 10**18).toFixed(6) : '0';
      
      // Convert STRK balance (6 decimals for simplicity)
      const strkBalance = strkBalanceResponse.result ? 
        (parseInt(strkBalanceResponse.result[0], 16) / 10**18).toFixed(6) : '0';
      
      setBalances({
        eth: ethBalance,
        strk: strkBalance
      });
    } catch (err) {
      console.error('Failed to fetch balances', err);
    } finally {
      setBalancesLoading(false);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const starknet = await connect({ modalMode: 'neverAsk' });
        if (starknet && starknet.isConnected) {
          const accounts = await starknet.enable();
          if (accounts.length > 0) {
            setWallet({
              address: accounts[0],
              provider: starknet.provider,
              isConnected: true,
            });
          }
        }
      } catch (err) {
        console.error('Failed to check wallet connection', err);
      }
    };

    checkConnection();
  }, []);
  
  // Fetch balances when wallet is connected
  useEffect(() => {
    if (wallet) {
      fetchBalances();
    }
  }, [wallet]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const starknet = await connect({
        modalMode: 'alwaysAsk',
        modalTheme: 'dark',
      });

      if (!starknet.isConnected) {
        await starknet.enable();
      }

      const accounts = await starknet.enable();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      setWallet({
        address: accounts[0],
        provider: starknet.provider,
        isConnected: true,
      });
    } catch (err: any) {
      console.error('Failed to connect wallet', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWallet(null);
    } catch (err) {
      console.error('Failed to disconnect wallet', err);
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // This is a simplified version - in a real app we'd need to use the 
      // specific starknet.js signing functions based on the wallet provider
      const signature = await wallet.provider.account.signMessage({
        message,
        domain: { name: 'StarkCitizenID', version: '1' },
      });
      return signature.toString();
    } catch (err: any) {
      console.error('Failed to sign message', err);
      throw new Error(err.message || 'Failed to sign message');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnect,
        signMessage,
        loading,
        error,
        balances,
        fetchBalances,
        balancesLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);