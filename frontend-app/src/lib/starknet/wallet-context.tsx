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
};

const WalletContext = createContext<WalletContextType>(initialContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);