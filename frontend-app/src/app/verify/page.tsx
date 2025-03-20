'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/france-connect/auth-context';
import VerifyIdentity from '@/components/identity/verify-identity';

export default function VerifyPage() {
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vérifiez votre identité</h1>
        <p className="text-muted-foreground">
          Liez votre identité FranceConnect à votre compte Starknet
        </p>
      </div>

      <VerifyIdentity />

      <div className="mt-8 rounded-lg border p-4">
        <h2 className="text-lg font-bold mb-2">Comment ça marche</h2>
        <p className="text-sm text-muted-foreground">
          Lorsque vous vérifiez votre identité, nous créons un hachage cryptographique des attributs de votre identité
          FranceConnect et le stockons sur la blockchain Starknet. Ce hachage est lié à l'adresse de votre portefeuille,
          prouvant que vous possédez à la fois l'identité et le portefeuille sans exposer vos informations personnelles.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Vos données personnelles ne quittent jamais votre navigateur et ne sont stockées sur aucun serveur. Seuls le
          hachage et le statut de vérification sont stockés sur la blockchain.
        </p>
      </div>
    </div>
  );
}