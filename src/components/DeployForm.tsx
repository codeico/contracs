'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import MemeToken from '../contracts/MemeToken.json';
import TimerToken from '../contracts/TimerToken.json';

export default function DeployForm({ walletAddress }: { walletAddress: string }) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [type, setType] = useState<'meme' | 'timer'>('meme');
  const [status, setStatus] = useState('');

  const switchTo0G = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x40D9' }], // 16601 decimal
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x40D9',
            chainName: '0G-Newton-Testnet',
            rpcUrls: ['https://evmrpc-testnet.0g.ai'],
            nativeCurrency: { name: '0G', symbol: '0G', decimals: 18 },
          }],
        });
      } else {
        alert('Gagal switch jaringan');
        return;
      }
    }
  };

  const deploy = async () => {
    if (!window.ethereum) return alert('MetaMask tidak ditemukan');
    await switchTo0G();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractData = type === 'meme' ? MemeToken : TimerToken;
    const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, signer);
    const contract = await factory.deploy(name, ticker);
    setStatus('Menunggu deploy...');
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    setStatus(`Sukses! Alamat kontrak: ${address}`);
  };

  if (!walletAddress) return <p className="text-red-500">Hubungkan wallet terlebih dahulu.</p>;

  return (
    <form onSubmit={e => { e.preventDefault(); deploy(); }} className="flex flex-col gap-3">
      <input placeholder="Nama Token" value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded" required />
      <input placeholder="Ticker" value={ticker} onChange={e => setTicker(e.target.value)} className="p-2 border rounded" required />
      <select value={type} onChange={e => setType(e.target.value as any)} className="p-2 border rounded">
        <option value="meme">Meme Token</option>
        <option value="timer">Timer Token</option>
      </select>
      <button type="submit" className="bg-green-600 text-white p-2 rounded">Deploy</button>
      <p>{status}</p>
    </form>
  );
}
