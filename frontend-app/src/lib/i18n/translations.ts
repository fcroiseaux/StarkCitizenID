// Définition du type pour les traductions
export type Translation = {
  [key: string]: string | Translation;
};

// Tableau des langues disponibles
export const availableLanguages = ['fr', 'en'] as const;
export type Language = typeof availableLanguages[number];

// Traductions françaises
export const frTranslations: Translation = {
  common: {
    loading: "Chargement...",
    home: "Accueil",
    dashboard: "Tableau de bord",
    verifyIdentity: "Vérifier l'identité",
    profile: "Profil",
    connectWallet: "Connecter le portefeuille",
    disconnectWallet: "Déconnecter le portefeuille",
    signOut: "Se déconnecter",
    signIn: "Se connecter avec FranceConnect",
    error: "Erreur",
    retry: "Réessayer",
    goToDashboard: "Accéder au tableau de bord",
    footer: "Vérification d'identité sécurisée sur Starknet",
  },
  home: {
    title: "Liez de façon sécurisée votre identité officielle compatible eIDAS (comme FranceConnect) à votre compte Starknet",
    verificationTitle: "Vérification d'identité",
    verificationDescription: "Vérifiez votre identité avec FranceConnect et liez-la à votre compte Starknet pour une vérification sécurisée sur la blockchain.",
    dashboardTitle: "Tableau de bord d'identité",
    dashboardDescription: "Consultez l'état de vérification de votre identité, gérez la vérification et connectez votre portefeuille Starknet.",
    howItWorks: "Comment ça marche",
    step1Title: "Authentifiez-vous avec FranceConnect",
    step1Description: "Utilisez votre identité officielle FranceConnect pour vous authentifier en toute sécurité via notre service.",
    step2Title: "Connectez votre portefeuille Starknet",
    step2Description: "Liez votre portefeuille Starknet pour créer une connexion entre votre identité et votre compte blockchain.",
    step3Title: "Vérifiez sur la blockchain",
    step3Description: "Votre identité est vérifiée sur Starknet sans révéler vos données personnelles, permettant des applications sécurisées sur la blockchain.",
  },
  login: {
    title: "Connexion avec FranceConnect",
    subtitle: "Authentifiez-vous avec votre identité numérique officielle française",
    description: "FranceConnect vous permet de prouver votre identité en toute sécurité en utilisant vos identifiants gouvernementaux français existants.",
    endpoints: "Utilisation des endpoints de",
    terms: "En vous connectant avec FranceConnect, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.",
    privacy: "Aucune donnée personnelle ne sera stockée sur nos serveurs. Votre identité sera vérifiée côté client et seul un hachage cryptographique sera stocké sur la blockchain Starknet.",
  },
  dashboard: {
    title: "Tableau de bord d'identité",
    subtitle: "Gérez votre identité vérifiée et vos fournisseurs",
    identityTab: "Identité",
    providersTab: "Fournisseurs",
    historyTab: "Historique",
    transactionsTitle: "Historique des transactions",
    transactionsDescription: "Votre historique des transactions de vérification apparaîtra ici.",
    noTransactions: "Aucune transaction trouvée",
  },
  verify: {
    title: "Vérifiez votre identité",
    subtitle: "Liez votre identité FranceConnect à votre compte Starknet",
    howTitle: "Comment ça marche",
    howDescription1: "Lorsque vous vérifiez votre identité, nous créons un hachage cryptographique des attributs de votre identité FranceConnect et le stockons sur la blockchain Starknet. Ce hachage est lié à l'adresse de votre portefeuille, prouvant que vous possédez à la fois l'identité et le portefeuille sans exposer vos informations personnelles.",
    howDescription2: "Vos données personnelles ne quittent jamais votre navigateur et ne sont stockées sur aucun serveur. Seuls le hachage et le statut de vérification sont stockés sur la blockchain.",
  },
  wallet: {
    title: "Connectez votre portefeuille Starknet",
    subtitle: "Connectez votre portefeuille Starknet pour interagir avec votre identité sur la blockchain",
    connectedTitle: "Portefeuille connecté avec succès",
    connectedSubtitle: "Redirection vers le tableau de bord...",
    supportedTitle: "Portefeuilles pris en charge",
    supportedDescription1: "Nous prenons en charge divers portefeuilles Starknet, notamment ArgentX, Braavos et d'autres. Assurez-vous d'avoir installé une extension de portefeuille Starknet dans votre navigateur.",
    supportedDescription2: "Votre portefeuille est utilisé pour signer les transactions qui vérifient votre identité sur la blockchain Starknet. Aucune donnée personnelle de votre identité FranceConnect n'est jamais partagée avec votre portefeuille.",
  },
  authError: {
    title: "Erreur d'authentification",
    subtitle: "Un problème est survenu lors de la connexion avec FranceConnect",
    tryAgain: "Veuillez réessayer. Si le problème persiste, contactez le support.",
    errors: {
      invalid_state: "Paramètre d'état invalide. Cela pourrait être dû à une attaque CSRF ou votre session a expiré.",
      no_code: "Aucun code d'autorisation reçu de FranceConnect.",
      invalid_nonce: "Nonce invalide. Cela pourrait être dû à une attaque par rejeu ou votre session a expiré.",
      token_exchange: "Échec de l'échange du code d'autorisation contre un jeton d'accès.",
      no_id_token: "Aucun jeton d'identité reçu de FranceConnect.",
      server_error: "Une erreur serveur inattendue s'est produite.",
      missing_config: "La configuration de FranceConnect est manquante.",
      default: "Une erreur inattendue s'est produite lors de l'authentification.",
    },
  },
  identityStatus: {
    title: "Statut d'identité",
    loading: "Chargement des informations d'identité...",
    status: "Statut :",
    address: "Adresse :",
    provider: "Fournisseur :",
    verifiedAt: "Vérifié le :",
    expiresAt: "Expire le :",
    noIdentity: "Aucune vérification d'identité trouvée pour cette adresse",
    revoked: "La vérification d'identité a été révoquée",
    expired: "La vérification d'identité a expiré",
    verified: "Identité vérifiée",
    revokeButton: "Révoquer la vérification",
    revoking: "Révocation...",
    renewButton: "Renouveler la vérification",
    verifyButton: "Vérifier l'identité",
  },
};

// Traductions anglaises
export const enTranslations: Translation = {
  common: {
    loading: "Loading...",
    home: "Home",
    dashboard: "Dashboard",
    verifyIdentity: "Verify Identity",
    profile: "Profile",
    connectWallet: "Connect Wallet",
    disconnectWallet: "Disconnect Wallet",
    signOut: "Sign Out",
    signIn: "Sign in with FranceConnect",
    error: "Error",
    retry: "Try Again",
    goToDashboard: "Go to Dashboard",
    footer: "Secure Identity Verification on Starknet",
  },
  home: {
    title: "Securely link your official eIDAS-compliant identity (like France Connect) to your Starknet account",
    verificationTitle: "Identity Verification",
    verificationDescription: "Verify your identity using France Connect and link it to your Starknet account for secure on-chain verification.",
    dashboardTitle: "Identity Dashboard",
    dashboardDescription: "View your identity verification status, manage verification, and connect your Starknet wallet.",
    howItWorks: "How It Works",
    step1Title: "Authenticate with France Connect",
    step1Description: "Use your official France Connect identity to securely authenticate through our service.",
    step2Title: "Connect Your Starknet Wallet",
    step2Description: "Link your Starknet wallet to create a connection between your identity and your blockchain account.",
    step3Title: "Verify On-Chain",
    step3Description: "Your identity is verified on Starknet without revealing personal data, enabling secure on-chain applications.",
  },
  login: {
    title: "Sign in with France Connect",
    subtitle: "Authenticate with your official French digital identity",
    description: "FranceConnect allows you to securely prove your identity using your existing French government credentials.",
    endpoints: "Using endpoints from",
    terms: "By signing in with FranceConnect, you agree to our Terms of Service and Privacy Policy.",
    privacy: "No personal data will be stored on our servers. Your identity will be verified client-side and only a cryptographic hash will be stored on the Starknet blockchain.",
  },
  dashboard: {
    title: "Identity Dashboard",
    subtitle: "Manage your verified identity and providers",
    identityTab: "Identity",
    providersTab: "Providers",
    historyTab: "History",
    transactionsTitle: "Transaction History",
    transactionsDescription: "Your verification transaction history will appear here.",
    noTransactions: "No transactions found",
  },
  verify: {
    title: "Verify Your Identity",
    subtitle: "Link your France Connect identity to your Starknet account",
    howTitle: "How It Works",
    howDescription1: "When you verify your identity, we create a cryptographic hash of your France Connect identity attributes and store it on the Starknet blockchain. This hash is linked to your wallet address, proving that you own both the identity and the wallet without exposing any personal information.",
    howDescription2: "Your personal data never leaves your browser and is not stored on any servers. Only the hash and verification status are stored on-chain.",
  },
  wallet: {
    title: "Connect Your Starknet Wallet",
    subtitle: "Connect your Starknet wallet to interact with your identity on the blockchain",
    connectedTitle: "Wallet Connected Successfully",
    connectedSubtitle: "Redirecting to dashboard...",
    supportedTitle: "Supported Wallets",
    supportedDescription1: "We support various Starknet wallets including ArgentX, Braavos, and others. Make sure you have a Starknet wallet extension installed in your browser.",
    supportedDescription2: "Your wallet is used to sign transactions that verify your identity on the Starknet blockchain. No personal data from your France Connect identity is ever shared with your wallet.",
  },
  authError: {
    title: "Authentication Error",
    subtitle: "There was a problem signing in with France Connect",
    tryAgain: "Please try again. If the problem persists, contact support.",
    errors: {
      invalid_state: "Invalid state parameter. This could be due to a CSRF attack or your session has expired.",
      no_code: "No authorization code received from France Connect.",
      invalid_nonce: "Invalid nonce. This could be due to a replay attack or your session has expired.",
      token_exchange: "Failed to exchange authorization code for access token.",
      no_id_token: "No ID token received from France Connect.",
      server_error: "An unexpected server error occurred.",
      missing_config: "France Connect configuration is missing.",
      default: "An unexpected error occurred during authentication.",
    },
  },
  identityStatus: {
    title: "Identity Status",
    loading: "Loading identity information...",
    status: "Status:",
    address: "Address:",
    provider: "Provider:",
    verifiedAt: "Verified At:",
    expiresAt: "Expires At:",
    noIdentity: "No identity verification found for this address",
    revoked: "Identity verification has been revoked",
    expired: "Identity verification has expired",
    verified: "Identity verified",
    revokeButton: "Revoke Verification",
    revoking: "Revoking...",
    renewButton: "Renew Verification",
    verifyButton: "Verify Identity",
  },
};

// Fonction pour récupérer une clé de traduction
export function getTranslationKey(
  translations: Translation,
  key: string
): string | Translation {
  const keys = key.split('.');
  let result: string | Translation = translations;

  for (const k of keys) {
    if (typeof result === 'string' || !(k in result)) {
      return key; // Clé non trouvée
    }
    result = result[k];
  }

  return result;
}