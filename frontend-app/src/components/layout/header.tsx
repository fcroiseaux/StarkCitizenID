'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/france-connect/auth-context';
import { useWallet } from '@/lib/starknet/wallet-context';

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { wallet, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">StarkCitizenID</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Tableau de bord
            </Link>
            <Link
              href="/verify"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/verify' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Vérifier l'identité
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {wallet ? (
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              asChild
            >
              <Link href="/wallet">Connecter le portefeuille</Link>
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.given_name?.charAt(0) || user?.family_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.given_name} {user?.family_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                {wallet && (
                  <DropdownMenuItem onClick={disconnect}>
                    Déconnecter le portefeuille
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Se connecter avec FranceConnect</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}