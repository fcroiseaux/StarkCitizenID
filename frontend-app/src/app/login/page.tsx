'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/france-connect/auth-context';
import { FranceConnectButton } from '@/components/auth/france-connect-button';
import { useLanguage } from '@/lib/i18n/language-context';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('login.description')}
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
              {t('login.endpoints')} {process.env.FRANCE_CONNECT_ISSUER || 'https://fcp.integ01.dev-franceconnect.fr'}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground mt-6">
            <p>{t('login.terms')}</p>
            <p className="mt-2">{t('login.privacy')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}