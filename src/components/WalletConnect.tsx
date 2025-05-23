'use client';
import { useState, useEffect } from 'react';

export default function WalletConnect({ onConnected }: { onConnected: (address: string) => void }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask tidak ditemukan.');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWalletAddress(accounts[0]);
    onConnected(accounts[0]);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setWalletAddress(accounts[0]);
        onConnected(accounts[0]);
      });
    }
  }, []);

  return (
    <div>
      {walletAddress ? (
        <p className="text-green-600">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet} className="bg-blue-600 text-white px-4 py-2 rounded">
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
