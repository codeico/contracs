'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import MemeToken from '../contracts/MemeToken.json';
import TimerToken from '../contracts/TimerToken.json';

// Tambahkan deklarasi ethereum ke window agar dikenali TypeScript
declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider;
  }
}

// Tipe data untuk file .json
interface ContractJson {
  abi: ethers.InterfaceAbi;
  bytecode: string;
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
        params: [{ chainId: '0x40D9' }], // 16601 in hex
      });
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 4902) {
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
      } else {
        alert('Gagal switch jaringan');
      }
    }
  };

  const deploy = async () => {
    if (!window.ethereum) return alert('MetaMask tidak ditemukan');
    await switchTo0G();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractData: ContractJson = type === 'meme' ? MemeToken : TimerToken;
    const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, signer);
    
    try {
      setStatus('Men-deploy kontrak...');
      const contract = await factory.deploy(name, ticker);
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      setStatus(`✅ Kontrak berhasil dideploy di alamat: ${address}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Gagal deploy kontrak');
    }
  };

  if (!walletAddress) return <p className="text-red-500">Hubungkan wallet terlebih dahulu.</p>;

  return (
    <form onSubmit={e => { e.preventDefault(); deploy(); }} className="flex flex-col gap-3 max-w-md mx-auto">
      <input
        placeholder="Nama Token"
        value={name}
        onChange={e => setName(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        placeholder="Ticker"
        value={ticker}
        onChange={e => setTicker(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <select
        value={type}
        onChange={e => setType(e.target.value as 'meme' | 'timer')}
        className="p-2 border rounded"
      >
        <option value="meme">Meme Token</option>
        <option value="timer">Timer Token</option>
      </select>
      <button type="submit" className="bg-green-600 text-white p-2 rounded">Deploy</button>
      <p className="text-sm">{status}</p>
    </form>
  );
}
