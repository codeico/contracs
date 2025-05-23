'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import MemeToken from '../contracts/MemeToken.json';
import TimerToken from '../contracts/TimerToken.json';

interface ContractJson {
  abi: ethers.InterfaceAbi;
  bytecode: string;
}

interface EthereumError extends Error {
  code?: number;
}

export default function DeployForm({ walletAddress }: { walletAddress: string }) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [type, setType] = useState<'meme' | 'timer'>('meme');
  const [status, setStatus] = useState('');

  const switchTo0G = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x40D9' }],
      });
    } catch (err: unknown) {
      const error = err as EthereumError;

      if (error?.code === 4902) {
        try {
          await window.ethereum.request?.({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x40D9',
              chainName: '0G-Newton-Testnet',
              rpcUrls: ['https://evmrpc-testnet.0g.ai'],
              nativeCurrency: {
                name: '0G',
                symbol: '0G',
                decimals: 18,
              },
            }],
          });
        } catch (addErr) {
          alert('Gagal menambahkan jaringan 0G');
          console.error(addErr);
        }
      } else {
        alert('Gagal switch jaringan');
        console.error(err);
      }
    }
  };

  const deploy = async () => {
    if (!window.ethereum) return alert('MetaMask tidak ditemukan');
    await switchTo0G();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractData: ContractJson = type === 'meme' ? MemeToken : TimerToken;
      const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, signer);

      setStatus('🚀 Men-deploy kontrak...');
      const contract = await factory.deploy(name, ticker);
      await contract.waitForDeployment();

      const address = await contract.getAddress();
      setStatus(`✅ Kontrak berhasil dideploy di alamat: ${address}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Gagal deploy kontrak');
    }
  };

  if (!walletAddress) {
    return <p className="text-red-400 text-center">⚠️ Hubungkan wallet terlebih dahulu.</p>;
  }

  return (
    <form
      onSubmit={e => { e.preventDefault(); deploy(); }}
      className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto mt-8 space-y-4 border border-zinc-700"
    >
      <h2 className="text-xl font-semibold text-center mb-2">Deploy Token ke 0G Testnet</h2>

      <input
        placeholder="Nama Token"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        placeholder="Ticker"
        value={ticker}
        onChange={e => setTicker(e.target.value)}
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <select
        value={type}
        onChange={e => setType(e.target.value as 'meme' | 'timer')}
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="meme">🎨 Meme Token</option>
        <option value="timer">⏱️ Timer Token</option>
      </select>
      <button
        type="submit"
        className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-colors duration-300"
      >
        Deploy
      </button>
      {status && (
        <p className="text-sm text-center mt-2 text-zinc-300 whitespace-pre-wrap">{status}</p>
      )}
    </form>
  );
}
