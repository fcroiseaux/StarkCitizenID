'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/france-connect/auth-context';
import IdentityStatus from '@/components/identity/identity-status';
import ProviderList from '@/components/identity-provider/provider-list';
import WalletConnect from '@/components/wallet/wallet-connect';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex justify-center py-12">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord d'identité</h1>
        <p className="text-muted-foreground">Gérez votre identité vérifiée et vos fournisseurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="identity">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="identity">Identité</TabsTrigger>
              <TabsTrigger value="providers">Fournisseurs</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identity" className="mt-6">
              <IdentityStatus />
            </TabsContent>
            
            <TabsContent value="providers" className="mt-6">
              <ProviderList />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold mb-4">Historique des transactions</h3>
                <p className="text-muted-foreground">Votre historique des transactions de vérification apparaîtra ici.</p>
                {/* In a real app, we would fetch transaction history from the blockchain */}
                <p className="text-sm text-muted-foreground mt-4">Aucune transaction trouvée</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}