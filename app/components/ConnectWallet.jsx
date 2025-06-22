"use client";

import { useEffect, useState } from 'react';
import { useWalletStore } from '../lib/walletConnect';

export default function ConnectWallet({ onConnect }) {
  // Get state and actions from the Zustand store
  const { 
    isConnected, 
    publicKey, 
    connect, 
    disconnect, 
    isLoading, 
    error,
    checkConnection 
  } = useWalletStore();

  // Local state for better UI feedback
  const [localStatus, setLocalStatus] = useState('idle');

  // On component mount, check for existing connection
  useEffect(() => {
    const initConnection = async () => {
      setLocalStatus('checking');
      try {
        await checkConnection();
        setLocalStatus('ready');
      } catch (err) {
        console.error('Initial connection check failed:', err);
        setLocalStatus('ready');
      }
    };
    
    initConnection();
  }, [checkConnection]);

  // Handle connection with callback
  const handleConnect = async () => {
    if (isConnected && publicKey) {
      // Already connected, just disconnect
      await disconnect();
      return;
    }

    setLocalStatus('connecting');
    try {
      await connect();
      setLocalStatus('connected');
      if (onConnect && isConnected) {
        onConnect();
      }
    } catch (err) {
      console.error('Connection error:', err);
      setLocalStatus('error');
      
      // Show user-friendly error message
      let userMessage = 'Cüzdan bağlantısı başarısız oldu.';
      
      if (err.message) {
        if (err.message.includes('yüklü değil')) {
          userMessage = 'Freighter cüzdanı yüklü değil. Lütfen https://www.freighter.app/ adresinden yükleyin.';
        } else if (err.message.includes('reddedildi')) {
          userMessage = 'Cüzdan erişimi reddedildi. Lütfen Freighter\'da izin verin.';
        } else if (err.message.includes('bağlanılamadı')) {
          userMessage = 'Cüzdana bağlanılamadı. Lütfen cüzdanınızı açın.';
        } else {
          userMessage = err.message;
        }
      }
      
      // You could show this in a toast or alert
      alert(userMessage);
    }
  };

  // Format public key for display with proper error handling
  const formatPublicKey = (key) => {
    if (!key || typeof key !== 'string') {
      return 'Bağlı değil';
    }
    
    if (key.length < 10) {
      return 'Geçersiz adres';
    }
    
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  // Determine button text and state
  const getButtonText = () => {
    if (localStatus === 'checking') return 'Kontrol ediliyor...';
    if (localStatus === 'connecting') return 'Bağlanıyor...';
    if (isLoading) return 'Yükleniyor...';
    if (isConnected && publicKey) return 'Bağlantıyı Kes';
    return 'Cüzdan Bağla';
  };

  const isButtonDisabled = localStatus === 'checking' || localStatus === 'connecting' || isLoading;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">
          {isConnected && publicKey ? 'Cüzdan Bağlı' : 'Cüzdan Bağlı Değil'}
        </div>
        <div className="text-sm text-gray-300 mb-4">
          {isConnected && publicKey ? formatPublicKey(publicKey) : 'Freighter cüzdanınızı bağlayın'}
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={isButtonDisabled}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${isConnected && publicKey
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
          ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        {getButtonText()}
      </button>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-sm text-red-200 max-w-md text-center">
          {error}
        </div>
      )}

      {localStatus === 'checking' && (
        <div className="text-blue-400 text-sm">
          Cüzdan durumu kontrol ediliyor...
        </div>
      )}
    </div>
  );
} 