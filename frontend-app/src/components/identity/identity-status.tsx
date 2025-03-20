'use client';

import { useState, useEffect } from 'react';
import { IdentityContract, Identity } from '@/lib/starknet/identity-contract';
import { useWallet } from '@/lib/starknet/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function IdentityStatus({ address }: { address?: string }) {
  const { wallet } = useWallet();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const targetAddress = address || (wallet ? wallet.address : '');

  useEffect(() => {
    const fetchIdentity = async () => {
      if (!targetAddress || !wallet) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const contract = new IdentityContract(wallet.provider);
        const identityData = await contract.getIdentityInfo(targetAddress);
        setIdentity(identityData);
      } catch (error) {
        console.error('Error fetching identity:', error);
        setIdentity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIdentity();
  }, [targetAddress, wallet]);

  const handleRevokeIdentity = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setRevoking(true);
    try {
      const contract = new IdentityContract(wallet.provider);
      await contract.revokeVerification();
      toast.success('Identity verification revoked successfully');
      
      // Refresh identity data
      const updatedIdentity = await contract.getIdentityInfo(wallet.address);
      setIdentity(updatedIdentity);
    } catch (error) {
      console.error('Error revoking identity:', error);
      toast.error('Failed to revoke identity verification');
    } finally {
      setRevoking(false);
    }
  };

  const isExpired = identity ? 
    (identity.expiration !== 0 && identity.expiration * 1000 < Date.now()) : 
    false;

  const renderStatus = () => {
    if (!identity || identity.address === '0x0') {
      return <p className="text-muted-foreground">No identity verification found for this address</p>;
    }

    if (!identity.verified) {
      return <p className="text-red-600">Identity verification has been revoked</p>;
    }

    if (isExpired) {
      return <p className="text-red-600">Identity verification has expired</p>;
    }

    return <p className="text-green-600">Identity verified</p>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Identity Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading identity information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <strong>Status:</strong>
          {renderStatus()}
        </div>

        {identity && identity.address !== '0x0' && (
          <>
            <div>
              <strong>Address:</strong>
              <p className="text-sm font-mono break-all">{identity.address}</p>
            </div>
            <div>
              <strong>Provider:</strong>
              <p>{identity.providerId}</p>
            </div>
            <div>
              <strong>Verified At:</strong>
              <p>{new Date(identity.timestamp * 1000).toLocaleString()}</p>
            </div>
            {identity.expiration !== 0 && (
              <div>
                <strong>Expires At:</strong>
                <p className={isExpired ? 'text-red-600' : ''}>
                  {new Date(identity.expiration * 1000).toLocaleString()}
                </p>
              </div>
            )}

            {!address && identity.verified && !isExpired && (
              <Button
                variant="destructive"
                onClick={handleRevokeIdentity}
                disabled={revoking}
                className="mt-4"
              >
                {revoking ? 'Revoking...' : 'Revoke Verification'}
              </Button>
            )}

            {isExpired && !address && (
              <Button asChild className="mt-4">
                <a href="/verify">Renew Verification</a>
              </Button>
            )}
          </>
        )}

        {(!identity || identity.address === '0x0') && !address && (
          <Button asChild className="mt-4">
            <a href="/verify">Verify Identity</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}