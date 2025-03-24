'use client';

import { useState } from 'react';
import ProviderList from '@/components/identity-provider/provider-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/starknet/wallet-context';
import WalletConnect from '@/components/wallet/wallet-connect';

export default function AdminProvidersPage() {
  const { wallet } = useWallet();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Provider Management</h1>
        <p className="text-muted-foreground">Manage identity providers directly with wallet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {wallet ? (
            <ProviderList />
          ) : (
            <Card>
              <CardContent className="py-4">
                <p>Please connect your wallet to manage identity providers</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}