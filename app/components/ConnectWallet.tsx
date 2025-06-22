"use client";

import React, { useState } from 'react';
import getPublicKey from '@stellar/freighter-api';
import connect from '@stellar/freighter-api';

export default function ConnectWallet() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
      await connect();
      const pk = await getPublicKey();
      setPublicKey(pk);
      setConnected(true);
    } catch (e: any) {
      setError('Failed to connect to Freighter. Please ensure the extension is installed and unlocked.');
    }
  };

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Connect Freighter Wallet</h3>
      {connected && publicKey ? (
        <div className="text-green-600">Connected: {publicKey}</div>
      ) : (
        <button className="bg-blue-600 text-white rounded-md py-2 px-4 font-medium hover:bg-blue-700" onClick={handleConnect}>
          Connect Freighter
        </button>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <p className="text-xs text-gray-500 mt-2">
        We use your Freighter wallet for secure, anonymous authentication. Your public key is never shared without your consent.
      </p>
    </div>
  );
}
