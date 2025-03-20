import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/france-connect/auth-context';
import { WalletProvider } from '@/lib/starknet/wallet-context';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StarkCitizenID - Identité eIDAS pour Starknet",
  description: "Liez votre identité officielle eIDAS à votre compte Starknet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <WalletProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container py-8">
                {children}
              </main>
              <footer className="py-4 border-t">
                <div className="container text-center text-sm text-muted-foreground">
                  <p>StarkCitizenID - Vérification d'identité sécurisée sur Starknet</p>
                </div>
              </footer>
            </div>
            <Toaster />
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
