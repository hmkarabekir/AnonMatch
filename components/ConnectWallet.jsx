import React, { useState } from 'react';
import { connect, getPublicKey } from '@stellar/freighter-api';

export default function ConnectWallet({ onConnect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Request wallet connection
      await connect();
      
      // Get public key
      const publicKey = await getPublicKey();
      
      // Call parent callback
      if (onConnect) {
        onConnect(publicKey);
      }
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(
        'Failed to connect to Freighter wallet. ' +
        'Please ensure the extension is installed and unlocked.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Connect Freighter Wallet</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          We use your Freighter wallet for secure, anonymous authentication. 
          Your public key is never shared without your explicit consent.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Privacy Notice:</strong> Your wallet public key is used only for:
          </p>
          <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
            <li>Secure authentication</li>
            <li>On-chain data storage</li>
            <li>Identity verification (only with mutual consent)</li>
          </ul>
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          'Connect Freighter Wallet'
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Don't have Freighter? <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download here</a></p>
      </div>
    </div>
  );
} 