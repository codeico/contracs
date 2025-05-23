'use client';
import { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import DeployForm from '../components/DeployForm';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <main className="min-h-screen p-8 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">🚀 0G Smart Contract Deployer</h1>
      <WalletConnect onConnected={setWalletAddress} />
      <DeployForm walletAddress={walletAddress} />
    </main>
  );
}
