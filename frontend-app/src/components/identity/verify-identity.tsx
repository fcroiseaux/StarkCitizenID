'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/france-connect/auth-context';
import { useWallet } from '@/lib/starknet/wallet-context';
import { IdentityContract } from '@/lib/starknet/identity-contract';
import { toast } from 'sonner';
import { createIdentityHash, prepareMessageHash } from '@/lib/utils/identity-utils';

export default function VerifyIdentity() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { wallet, connectWallet } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyIdentity = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please authenticate with France Connect first');
      return;
    }

    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsVerifying(true);
    try {
      // Step 1: Create identity hash from user data
      const identityHash = createIdentityHash({
        sub: user.sub,
        given_name: user.given_name,
        family_name: user.family_name,
        birth_date: user.birth_date,
      });

      // Step 2: Prepare metadata
      const metadataUri = JSON.stringify({
        provider: 'France Connect',
        verified_at: new Date().toISOString(),
      });

      // Step 3: Set expiration (1 year from now)
      const expiration = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      // Step 4: Set provider ID
      const providerId = 'france_connect';

      // Step 5: Prepare message hash for signing
      const messageHash = await prepareMessageHash({
        identityHash,
        metadataUri,
        expiration,
        providerId,
        userAddress: wallet.address,
      });

      // Step 6: Sign message hash (in a real app, this would be done by the identity provider)
      // For testing purposes, we'll use placeholder values
      const signatureR = '0x123456789abcdef';
      const signatureS = '0x123456789abcdef';

      // Step 7: Register identity on the smart contract
      const contract = new IdentityContract(wallet.provider);
      const txHash = await contract.registerIdentity(
        identityHash,
        metadataUri,
        expiration,
        providerId,
        signatureR,
        signatureS,
        messageHash
      );

      toast.success('Identity verification submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during identity verification:', error);
      toast.error('Failed to verify identity');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>
            Verify your identity with France Connect and link it to your Starknet account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Please authenticate with France Connect first to proceed with verification.</p>
          <Button asChild>
            <a href="/login">Sign in with France Connect</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Link your verified France Connect identity to your Starknet account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && (
          <div className="space-y-2">
            <p><strong>Authenticated as:</strong></p>
            <p>
              {user.given_name} {user.family_name} 
              {user.birth_date && ` (Born: ${user.birth_date})`}
            </p>
          </div>
        )}

        {!wallet ? (
          <div className="space-y-4">
            <p>Connect your Starknet wallet to link your identity</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p><strong>Wallet Address:</strong></p>
              <p className="text-sm font-mono break-all">{wallet.address}</p>
            </div>
            <Button 
              onClick={handleVerifyIdentity} 
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify Identity'}
            </Button>
            <p className="text-xs text-muted-foreground">
              By clicking Verify, your France Connect identity will be linked to your Starknet account.
              Only a cryptographic hash of your identity will be stored on-chain.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}