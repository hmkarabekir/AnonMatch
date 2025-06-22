"use client";

import { useEffect, useState } from 'react';

// Type declarations for Freighter
declare global {
  interface Window {
    freighterApi?: {
      isConnected(): Promise<boolean>;
      requestAccess(): Promise<string>;
      getNetwork(): Promise<string>;
    };
    freighter?: any;
    stellar?: any;
  }
}

export default function TestFreighter() {
  const [freighterStatus, setFreighterStatus] = useState('Checking...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        // Check if we're in browser
        if (typeof window === 'undefined') {
          setFreighterStatus('Server side - cannot check');
          return;
        }

        // Check multiple ways to detect Freighter
        const checks = {
          'window.freighterApi': !!window.freighterApi,
          'window.freighter': !!window.freighter,
          'window.stellar': !!window.stellar,
          'document.querySelector': !!document.querySelector('script[src*="freighter"]')
        };

        setDetails(JSON.stringify(checks, null, 2));

        if (Object.values(checks).some(check => check)) {
          setFreighterStatus('Freighter detected!');
          
          // Try to connect
          try {
            if (window.freighterApi) {
              const isConnected = await window.freighterApi.isConnected();
              setDetails(prev => prev + '\n\nisConnected: ' + isConnected);
              
              if (isConnected) {
                const address = await window.freighterApi.requestAccess();
                setDetails(prev => prev + '\n\nAddress: ' + address);
              }
            }
          } catch (err) {
            setDetails(prev => prev + '\n\nConnection error: ' + (err as Error).message);
          }
        } else {
          setFreighterStatus('Freighter NOT detected');
        }

      } catch (error) {
        setFreighterStatus('Error: ' + (error as Error).message);
      }
    };

    checkFreighter();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Freighter Test Page</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Status: {freighterStatus}</h2>
          
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">Details:</h3>
            <pre className="text-sm whitespace-pre-wrap">{details}</pre>
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="space-y-2 text-sm">
            <li>• Freighter extension'ının yüklü olduğundan emin olun</li>
            <li>• Browser'ı yeniden başlatın</li>
            <li>• Extension'ı devre dışı bırakıp tekrar etkinleştirin</li>
            <li>• https://www.freighter.app/ adresinden yeniden yükleyin</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 