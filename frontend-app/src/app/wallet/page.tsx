'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WalletConnect from '@/components/wallet/wallet-connect';
import { useWallet } from '@/lib/starknet/wallet-context';

export default function WalletPage() {
  const router = useRouter();
  const { wallet } = useWallet();
  
  useEffect(() => {
    if (wallet) {
      // If wallet is connected, redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [wallet, router]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Connectez votre portefeuille Starknet</h1>
        <p className="text-muted-foreground">
          Connectez votre portefeuille Starknet pour interagir avec votre identité sur la blockchain
        </p>
      </div>

      <WalletConnect />

      {wallet && (
        <Card className="mt-8 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Portefeuille connecté avec succès</CardTitle>
            <CardDescription>Redirection vers le tableau de bord...</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Accéder au tableau de bord
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 rounded-lg border p-4">
        <h2 className="text-lg font-bold mb-2">Portefeuilles pris en charge</h2>
        <p className="text-sm text-muted-foreground">
          Nous prenons en charge divers portefeuilles Starknet, notamment ArgentX, Braavos et d'autres.
          Assurez-vous d'avoir installé une extension de portefeuille Starknet dans votre navigateur.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Votre portefeuille est utilisé pour signer les transactions qui vérifient votre identité sur la blockchain Starknet.
          Aucune donnée personnelle de votre identité FranceConnect n'est jamais partagée avec votre portefeuille.
        </p>
      </div>
    </div>
  );
}