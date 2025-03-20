# StarkCitizenID Frontend DApp

This is the frontend for the StarkCitizenID project, a decentralized application that allows users to link their official eIDAS-compliant identity (like France Connect) to their Starknet blockchain account.

## Features

- **eIDAS Identity Integration**: Authenticate with France Connect or other eIDAS-compliant identity providers
- **Starknet Wallet Connection**: Link your blockchain account to your verified identity
- **Identity Management**: Register, update, or revoke your identity verification
- **Provider Management**: Add or revoke identity providers (admin only)
- **Identity Verification**: Check the verification status of any Starknet address

## Technologies Used

- [Next.js 14](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Starknet.js](https://www.starknetjs.com/) for Starknet interaction
- [get-starknet](https://github.com/starknet-io/get-starknet) for wallet connections
- [JWT](https://jwt.io/) for secure authentication tokens

## Project Structure

```
src/
├── app/               # Next.js app router pages
├── components/        # React components
│   ├── auth/          # Authentication components
│   ├── identity/      # Identity verification components
│   ├── identity-provider/ # Provider management components
│   ├── layout/        # Layout components (header, footer)
│   ├── ui/            # UI components from shadcn/ui
│   └── wallet/        # Wallet connection components
├── lib/               # Library code
│   ├── france-connect/ # France Connect integration
│   ├── starknet/      # Starknet integration
│   └── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Starknet wallet (ArgentX, Braavos, etc.)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/StarkCitizenID.git
   cd StarkCitizenID/frontend-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the required environment variables:
   ```
   # France Connect Environment Variables
   FRANCE_CONNECT_CLIENT_ID=your_client_id
   FRANCE_CONNECT_CLIENT_SECRET=your_client_secret
   FRANCE_CONNECT_REDIRECT_URI=http://localhost:3000/api/auth/callback
   FRANCE_CONNECT_ISSUER=https://app.franceconnect.gouv.fr/api/v1
   FRANCE_CONNECT_JWKS_URI=https://app.franceconnect.gouv.fr/api/v1/jwks

   # Starknet Environment Variables
   NEXT_PUBLIC_STARKNET_IDENTITY_CONTRACT_ADDRESS=0x123456
   NEXT_PUBLIC_STARKNET_NETWORK=goerli-alpha

   # Next Auth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect your wallet** through the wallet page or the header button
2. **Sign in with France Connect** to obtain your verified identity
3. **Link your identity** with your Starknet account through the verification page
4. **Manage your identity** and view verification status on the dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.
