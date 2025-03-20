import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl">
          StarkCitizenID
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Liez de façon sécurisée votre identité officielle compatible eIDAS (comme FranceConnect) à votre compte Starknet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="card space-y-4">
          <h2 className="text-2xl font-bold">Vérification d'identité</h2>
          <p className="text-gray-600">
            Vérifiez votre identité avec FranceConnect et liez-la à votre compte Starknet pour une vérification sécurisée sur la blockchain.
          </p>
          <Link href="/verify" className="btn">Vérifier l'identité</Link>
        </div>

        <div className="card space-y-4">
          <h2 className="text-2xl font-bold">Tableau de bord d'identité</h2>
          <p className="text-gray-600">
            Consultez l'état de vérification de votre identité, gérez la vérification et connectez votre portefeuille Starknet.
          </p>
          <Link href="/dashboard" className="btn btn-outline">Accéder au tableau de bord</Link>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-8 mt-8">
        <h2 className="text-2xl font-bold text-center">Comment ça marche</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>1</div>
            <h3 className="font-bold">Authentifiez-vous avec FranceConnect</h3>
            <p className="text-sm text-gray-600">
              Utilisez votre identité officielle FranceConnect pour vous authentifier en toute sécurité via notre service.
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>2</div>
            <h3 className="font-bold">Connectez votre portefeuille Starknet</h3>
            <p className="text-sm text-gray-600">
              Liez votre portefeuille Starknet pour créer une connexion entre votre identité et votre compte blockchain.
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>3</div>
            <h3 className="font-bold">Vérifiez sur la blockchain</h3>
            <p className="text-sm text-gray-600">
              Votre identité est vérifiée sur Starknet sans révéler vos données personnelles, permettant des applications sécurisées sur la blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
