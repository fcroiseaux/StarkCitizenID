'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/france-connect/auth-context';
import { FranceConnectButton } from '@/components/auth/france-connect-button';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion avec FranceConnect</CardTitle>
          <CardDescription>
            Authentifiez-vous avec votre identité numérique officielle française
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            FranceConnect vous permet de prouver votre identité en toute sécurité en utilisant vos identifiants gouvernementaux français existants.
          </p>
          
          <div className="flex justify-center">
            <FranceConnectButton 
              onClick={login} 
              loading={loading}
              size="lg"
            />
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 mt-1">
              Utilisation des endpoints de {process.env.FRANCE_CONNECT_ISSUER || 'https://fcp.integ01.dev-franceconnect.fr'}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground mt-6">
            <p>En vous connectant avec FranceConnect, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.</p>
            <p className="mt-2">Aucune donnée personnelle ne sera stockée sur nos serveurs. Votre identité sera vérifiée côté client et seul un hachage cryptographique sera stocké sur la blockchain Starknet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}