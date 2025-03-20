'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const errorMessages: Record<string, string> = {
  invalid_state: 'Paramètre d\'état invalide. Cela pourrait être dû à une attaque CSRF ou votre session a expiré.',
  no_code: 'Aucun code d\'autorisation reçu de FranceConnect.',
  invalid_nonce: 'Nonce invalide. Cela pourrait être dû à une attaque par rejeu ou votre session a expiré.',
  token_exchange: 'Échec de l\'échange du code d\'autorisation contre un jeton d\'accès.',
  no_id_token: 'Aucun jeton d\'identité reçu de FranceConnect.',
  server_error: 'Une erreur serveur inattendue s\'est produite.',
  missing_config: 'La configuration de FranceConnect est manquante.',
  default: 'Une erreur inattendue s\'est produite lors de l\'authentification.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || 'default';
  const errorMessage = errorMessages[errorCode] || errorMessages.default;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Erreur d'authentification</CardTitle>
          <CardDescription>
            Un problème est survenu lors de la connexion avec FranceConnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{errorMessage}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Veuillez réessayer. Si le problème persiste, contactez le support.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Accueil</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Réessayer</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  );
}