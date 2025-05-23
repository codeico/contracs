'use client';

import { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import DeployForm from '../components/DeployForm';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center bg-black text-white">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold mb-4">🚀 0G Smart Contract Deployer</h1>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <WalletConnect onConnected={setWalletAddress} />
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-6">
          <DeployForm walletAddress={walletAddress} />
        </div>
      </div>
    </main>
  );
}
