'use client';
import { useState, useEffect } from 'react';

export default function WalletConnect({ onConnected }: { onConnected: (address: string) => void }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask tidak ditemukan.');
      return;
    }

    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      onConnected(accounts[0]);
    } catch (err) {
      console.error('Gagal konek ke MetaMask:', err);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        onConnected(accounts[0]);
      } else {
        setWalletAddress(null);
      }
    };
  
    if (window.ethereum?.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [onConnected]);
  

  return (
    <div>
      {walletAddress ? (
        <p className="text-green-600">
          Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <center><button onClick={connectWallet} className="bg-blue-600 text-white px-4 py-2 rounded">
        Connect MetaMask
      </button></center>
      )}
    </div>
  );
}
