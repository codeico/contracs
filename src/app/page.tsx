'use client';

import { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import DeployForm from '../components/DeployForm';
import DeployedContracts from '../components/DeployedContracts';
import { Sparkles, Rocket } from 'lucide-react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [localContracts, setLocalContracts] = useState<
    { name: string; address: string; type: string }[]
  >([]);

  const handleNewContract = (contract: { name: string; address: string; type: string }) => {
    setLocalContracts(prev => [contract, ...prev]);
  };

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center bg-gradient-to-br from-black via-zinc-900 to-black text-white font-sans">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            <Rocket className="inline-block w-8 h-8 mr-2 animate-pulse" /> 0G Contract Deployer
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">Power to the devs. Deploy smart contracts in seconds 🚀</p>
        </div>

        <div className="bg-zinc-900/60 p-6 rounded-2xl shadow-xl border border-zinc-700 backdrop-blur">
          <WalletConnect onConnected={setWalletAddress} />
        </div>

        <div className="bg-zinc-900/60 p-6 rounded-2xl shadow-xl border border-zinc-700 backdrop-blur">
          <DeployForm walletAddress={walletAddress} onDeployed={handleNewContract} />
        </div>

        {walletAddress && (
          <div className="bg-zinc-900/60 p-6 rounded-2xl shadow-xl border border-zinc-700 backdrop-blur">
            <DeployedContracts wallet={walletAddress} newContracts={localContracts} />
          </div>
        )}

        <footer className="text-center text-zinc-500 text-xs mt-8">
          Made with <Sparkles className="inline-block w-4 h-4 text-pink-400 animate-bounce mx-1" /> by BANGCODE
        </footer>
      </div>
    </main>
  );
}
