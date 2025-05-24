'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // pastikan path sesuai struktur proyek
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DeployedContracts({
    wallet,
    newContracts = [],
  }: {
    wallet: string;
    newContracts?: { name: string; address: string; type: string }[];
  }) {
    const [contracts, setContracts] = useState<{ name: string; address: string; type: string }[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchContracts = async () => {
        const q = query(collection(db, 'contracts'), where('wallet', '==', wallet));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data() as any);
        setContracts(data);
        setLoading(false);
      };
  
      if (wallet) fetchContracts();
    }, [wallet]);
  
    const allContracts = [...newContracts, ...contracts];
  
    if (loading) return <p className="text-gray-400">Memuat kontrak...</p>;
    if (allContracts.length === 0) return <p className="text-gray-400">Belum ada kontrak yang dideploy.</p>;
  
    return (
      <div className="text-left">
        <h2 className="text-xl font-semibold mb-2 text-white">📜 Kontrak yang Dideploy</h2>
        <ul className="space-y-2">
          {allContracts.map((contract, index) => (
            <li key={index} className="bg-gray-800 p-3 rounded">
              <p><strong>Nama:</strong> {contract.name}</p>
              <p><strong>Alamat:</strong> {contract.address}</p>
              <p><strong>Tipe:</strong> {contract.type}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  