'use client';

import { useState, useEffect } from 'react';
import { IdentityContract, IdentityProvider } from '@/lib/starknet/identity-contract';
import { useWallet } from '@/lib/starknet/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddProviderForm from './add-provider-form';

export default function ProviderList() {
  const { wallet } = useWallet();
  const [providers, setProviders] = useState<IdentityProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProviders = async () => {
    if (!wallet) return;
    
    setLoading(true);
    try {
      const contract = new IdentityContract(wallet.provider);
      
      // This is a simplified approach - in a real app we would need
      // to query events or have a list of provider IDs
      const knownProviderIds = ['france_connect', 'test_provider'];
      const providersData = await Promise.all(
        knownProviderIds.map(async (id) => {
          try {
            return await contract.getIdentityProvider(id);
          } catch (error) {
            console.error(`Failed to fetch provider ${id}:`, error);
            return null;
          }
        })
      );
      
      setProviders(providersData.filter(Boolean) as IdentityProvider[]);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to fetch identity providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchProviders();
    }
  }, [wallet]);

  const handleDeactivateProvider = async (id: string) => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const contract = new IdentityContract(wallet.provider);
      await contract.deactivateIdentityProvider(id);
      toast.success('Identity provider deactivated successfully');
      fetchProviders();
    } catch (error) {
      console.error('Error deactivating provider:', error);
      toast.error('Failed to deactivate identity provider');
    }
  };

  const handleAddProvider = async (provider: {
    id: string;
    name: string;
    publicKey: string;
  }) => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const contract = new IdentityContract(wallet.provider);
      await contract.addIdentityProvider(
        provider.id,
        provider.name,
        provider.publicKey
      );
      toast.success('Identity provider added successfully');
      setShowAddForm(false);
      fetchProviders();
    } catch (error) {
      console.error('Error adding provider:', error);
      toast.error('Failed to add identity provider');
    }
  };

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Identity Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect your wallet to manage identity providers</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Identity Providers</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Provider'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Identity Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProviderForm onSubmit={handleAddProvider} onCancel={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p>Loading providers...</p>
      ) : providers.length === 0 ? (
        <p>No identity providers found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{provider.name}</span>
                  <span className={`text-sm px-2 py-1 rounded ${provider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {provider.id}</p>
                  <p><strong>Public Key:</strong> {`${provider.publicKey.substring(0, 10)}...${provider.publicKey.substring(provider.publicKey.length - 6)}`}</p>
                  <p><strong>Added:</strong> {new Date(provider.addedTimestamp * 1000).toLocaleString()}</p>
                </div>
                {provider.isActive && (
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => handleDeactivateProvider(provider.id)}
                  >
                    Deactivate Provider
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}