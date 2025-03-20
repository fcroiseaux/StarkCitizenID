'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FranceConnectButton } from '@/components/auth/france-connect-button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/france-connect/auth-context';
import { useWallet } from '@/lib/starknet/wallet-context';
import { IdentityContract, Identity } from '@/lib/starknet/identity-contract';
import { toast } from 'sonner';

export default function HomePage() {
  const { t } = useLanguage();
  const { isAuthenticated, user, login, loading: authLoading } = useAuth();
  const { wallet, connectWallet, loading: walletLoading, balances, balancesLoading, fetchBalances } = useWallet();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  // Fetch identity information when wallet is connected
  useEffect(() => {
    async function fetchIdentity() {
      if (!wallet) {
        setIdentity(null);
        return;
      }

      setIdentityLoading(true);
      try {
        const contract = new IdentityContract(wallet.provider);
        const identityData = await contract.getIdentityInfo(wallet.address);
        setIdentity(identityData);
      } catch (error) {
        console.error('Error fetching identity:', error);
        setIdentity(null);
      } finally {
        setIdentityLoading(false);
      }
    }

    fetchIdentity();
  }, [wallet]);

  // Function to link the identities
  const linkIdentities = async () => {
    if (!isAuthenticated || !wallet) {
      return;
    }

    setLinkLoading(true);
    try {
      // Redirect to the verification page to start the linking process
      window.location.href = '/verify';
    } catch (error) {
      console.error('Error starting linkage process:', error);
      toast.error('Failed to start identity verification');
      setLinkLoading(false);
    }
  };

  // Check if identities can be linked
  const canLink = isAuthenticated && wallet && (!identity || identity.address === '0x0' || !identity.verified);

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if identity is already linked
  const isLinked = identity && identity.address !== '0x0' && identity.verified;
  
  // Check if identity is expired
  const isExpired = identity ? 
    (identity.expiration !== 0 && identity.expiration * 1000 < Date.now()) : 
    false;

  // Format date for display
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="flex flex-col items-center space-y-12 py-8">
      <div className="text-center space-y-4 mb-4">
        <h1 className="text-4xl font-bold sm:text-5xl">
          StarkCitizenID
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {t('home.title')}
        </p>
      </div>

      {/* Identity Connection Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl" style={{ gridAutoRows: "1fr" }}>
        {/* France Connect Identity Box */}
        <Card className="border border-blue-200 dark:border-blue-800 shadow-lg h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇫🇷</span>
                <CardTitle className="text-lg font-medium">{t('home.fcBoxTitle')}</CardTitle>
              </div>
              {isAuthenticated && (
                <div className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {t('home.fcBoxConnected')}
                </div>
              )}
            </div>
            <CardDescription className="text-sm opacity-80">{t('home.fcBoxDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center" style={{ minHeight: "280px" }}>
            {isAuthenticated ? (
              <div className="space-y-5 flex-1 flex flex-col justify-center">
                {user?.given_name && user?.family_name && (
                  <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg p-4">
                    <strong className="block text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1 font-medium">{t('home.fcBoxName')}</strong>
                    <p className="text-xl font-medium">{user.given_name} {user.family_name}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {user?.birth_date && (
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.fcBoxBirthDate')}</strong>
                      <p className="font-medium">{user.birth_date}</p>
                    </div>
                  )}
                  {user?.email && (
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.fcBoxEmail')}</strong>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="text-center max-w-xs mx-auto">
                  <p className="mb-6 text-muted-foreground text-sm">{t('home.fcBoxConnect')}</p>
                  <FranceConnectButton 
                    onClick={login} 
                    loading={authLoading}
                    size="default"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Middle Connection Box */}
        <Card className="border border-indigo-200 dark:border-indigo-800 shadow-lg h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                <CardTitle className="text-lg font-medium">{t('home.idBoxTitle')}</CardTitle>
              </div>
              {isLinked && !isExpired && (
                <div className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {t('home.idBoxLinked')}
                </div>
              )}
              {isLinked && isExpired && (
                <div className="bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {t('home.idBoxExpired')}
                </div>
              )}
            </div>
            <CardDescription className="text-sm opacity-80">{t('home.idBoxDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center" style={{ minHeight: "280px" }}>
            {identityLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="mt-3 text-sm text-muted-foreground">{t('home.idBoxLoading')}</p>
              </div>
            ) : isLinked ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-indigo-50/60 dark:bg-indigo-900/20 p-5 rounded-lg space-y-4">
                  <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 uppercase tracking-wider">{t('home.idBoxInfoTitle')}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.idBoxStatus')}</strong>
                      <p className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {isExpired ? t('home.idBoxStatusExpired') : t('home.idBoxStatusVerified')}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.idBoxVerifiedAt')}</strong>
                      <p className="font-medium">{formatDate(identity?.timestamp || 0)}</p>
                    </div>
                    {identity?.expiration !== 0 && (
                      <div className="col-span-2">
                        <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.idBoxExpiresAt')}</strong>
                        <p className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {formatDate(identity?.expiration || 0)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  {isExpired ? (
                    <Button asChild className="w-full">
                      <Link href="/verify">{t('home.idBoxRenew')}</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard">{t('home.idBoxManage')}</Link>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center max-w-xs mx-auto space-y-6">
                  <div className="relative h-24 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 dark:text-indigo-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-5">{t('home.idBoxLinkText')}</p>
                    <Button 
                      onClick={linkIdentities} 
                      disabled={!canLink || linkLoading}
                      className="w-full"
                      variant="default"
                    >
                      {linkLoading ? t('home.idBoxLoading') : t('home.idBoxLinkButton')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Starknet Wallet Box */}
        <Card className="border border-purple-200 dark:border-purple-800 shadow-lg h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦄</span>
                <CardTitle className="text-lg font-medium">{t('home.walletBoxTitle')}</CardTitle>
              </div>
              {wallet && (
                <div className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {t('home.walletBoxConnected')}
                </div>
              )}
            </div>
            <CardDescription className="text-sm opacity-80">{t('home.walletBoxDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center" style={{ minHeight: "280px" }}>
            {wallet ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-purple-50/60 dark:bg-purple-900/20 p-5 rounded-lg mb-4">
                  <strong className="block text-xs uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-2 font-medium">{t('home.walletBoxAddress')}</strong>
                  <div className="font-mono text-sm overflow-hidden bg-white/80 dark:bg-black/20 p-2 rounded border border-purple-100 dark:border-purple-800/30">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{formatAddress(wallet.address)}</span>
                      <div className="text-xs text-purple-500 dark:text-purple-400 ml-2 cursor-pointer hover:underline whitespace-nowrap" 
                           onClick={() => {
                             navigator.clipboard.writeText(wallet.address);
                             toast.success(t('home.walletBoxCopied'));
                           }}>
                        {t('home.walletBoxCopy')}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('home.walletBoxNetwork')}: {process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'testnet'}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">{t('home.walletBoxType')}</strong>
                  <p className="font-medium">{t('home.walletBoxTypeValue')}</p>
                </div>
                
                <div className="mt-5">
                  <strong className="block text-xs uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-2 font-medium">{t('home.walletBoxBalances')}</strong>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 dark:bg-black/20 p-3 rounded border border-purple-100 dark:border-purple-800/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-800 dark:text-purple-300 font-medium">ETH</span>
                        {balancesLoading ? (
                          <div className="h-4 w-4 border-t-2 border-purple-500 rounded-full animate-spin ml-1"></div>
                        ) : (
                          <span className="font-mono text-base font-medium">{balances.eth}</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/80 dark:bg-black/20 p-3 rounded border border-purple-100 dark:border-purple-800/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-800 dark:text-purple-300 font-medium">STRK</span>
                        {balancesLoading ? (
                          <div className="h-4 w-4 border-t-2 border-purple-500 rounded-full animate-spin ml-1"></div>
                        ) : (
                          <span className="font-mono text-base font-medium">{balances.strk}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={fetchBalances} 
                    className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                    disabled={balancesLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {balancesLoading ? t('home.walletBoxRefreshing') : t('home.walletBoxRefresh')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center max-w-xs mx-auto space-y-6">
                  <div className="relative h-24 flex items-center justify-center">
                    <Image 
                      src="/file.svg" 
                      alt="Starknet Wallet" 
                      width={64} 
                      height={64}
                      className="opacity-40"
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-5">{t('home.walletBoxConnect')}</p>
                    <Button 
                      onClick={connectWallet} 
                      disabled={walletLoading}
                      className="w-full"
                      variant="default"
                    >
                      {walletLoading ? t('home.walletBoxConnecting') : t('home.walletBoxConnectButton')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it works section */}
      <div className="w-full max-w-5xl space-y-8 mt-4">
        <h2 className="text-2xl font-bold text-center">{t('home.howItWorks')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-transparent border-2 border-blue-500 w-10 h-10 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">1</div>
            <h3 className="font-bold">{t('home.step1Title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('home.step1Description')}
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-transparent border-2 border-indigo-500 w-10 h-10 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">2</div>
            <h3 className="font-bold">{t('home.step2Title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('home.step2Description')}
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-transparent border-2 border-purple-500 w-10 h-10 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">3</div>
            <h3 className="font-bold">{t('home.step3Title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('home.step3Description')}
            </p>
          </div>
        </div>
      </div>
      
      {/* DeFi Section */}
      <div className="w-full max-w-5xl space-y-8 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 rounded-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">{t('home.defiTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('home.defiSubtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">{t('home.forUsersTitle')}</h3>
            <ul className="space-y-3">
              {t('home.forUsersItems').map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">{t('home.forProvidersTitle')}</h3>
            <ul className="space-y-3">
              {t('home.forProvidersItems').map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">{t('home.privacyTitle')}</h3>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                {t('home.privacyDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
