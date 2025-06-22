"use client";

import React, { useState } from 'react';

export default function PasskeyLogin({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate passkey authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate successful login
      console.log('Passkey authentication successful');
      
      // Close modal if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError('Passkey girişi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🔑</span>
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">
          Passkey ile Giriş Yapın
        </h4>
        <p className="text-gray-300 text-sm">
          Güvenli ve hızlı giriş için passkey kullanın
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handlePasskeyLogin}
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Giriş yapılıyor...</span>
            </>
          ) : (
            <>
              <span>🔑</span>
              <span>Passkey ile Giriş</span>
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-400 text-xs">
            Passkey, cihazınızda kayıtlı biyometrik verilerinizi kullanır
          </p>
        </div>
      </div>
    </div>
  );
}
