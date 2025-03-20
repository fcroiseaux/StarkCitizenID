'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/lib/starknet/wallet-context';
import { toast } from 'sonner';

export default function WalletConnect() {
  const { wallet, connectWallet, disconnect, loading, error } = useWallet();
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully');
    } catch (err: any) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowDisconnect(false);
    toast.success('Wallet disconnected');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Starknet Wallet</CardTitle>
        <CardDescription>
          Connect your Starknet wallet to manage your identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallet ? (
          <>
            <div className="space-y-2">
              <div>
                <strong>Connected Address:</strong>
                <p className="text-sm font-mono break-all">{wallet.address}</p>
              </div>
              <div>
                <strong>Network:</strong>
                <p>{process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'testnet'}</p>
              </div>
            </div>
            {!showDisconnect ? (
              <Button variant="outline" onClick={() => setShowDisconnect(true)}>
                Manage Wallet
              </Button>
            ) : (
              <div className="space-y-2">
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect Wallet
                </Button>
                <Button variant="outline" onClick={() => setShowDisconnect(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p>
              Connect your Starknet wallet to verify your identity or manage your identity providers.
            </p>
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}